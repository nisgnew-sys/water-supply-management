import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Edit3, AlertTriangle, MapPin, Activity, Droplets, Target, BarChart3 } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Detection {
    _id: string; location: string; pipeline: string; severity: string;
    detectedDate: string; status: string; repairDate?: string; description?: string;
}
interface DMA {
    _id: string; name: string; area: string; zone: string;
    totalConnections: number; nrwPercent: number; targetNrw: number;
}

type Tab = 'detections' | 'dmas';

const mockDetections: Detection[] = [
    { _id: '1', location: 'GNB Road, Km 2.3', pipeline: 'Main Trunk Line A', severity: 'High', detectedDate: '2026-02-10', status: 'Open', description: 'Major joint leak' },
    { _id: '2', location: 'Zoo Road, Km 0.8', pipeline: 'Distribution Line B-12', severity: 'Medium', detectedDate: '2026-02-08', status: 'Under Repair', description: 'Pipe crack' },
    { _id: '3', location: 'Dispur, Km 1.5', pipeline: 'Trunk Line C', severity: 'Low', detectedDate: '2026-02-05', status: 'Resolved', repairDate: '2026-02-07', description: 'Minor seepage' },
    { _id: '4', location: 'Chandmari, Km 3.1', pipeline: 'Distribution Line A-05', severity: 'Critical', detectedDate: '2026-02-12', status: 'Open', description: 'Burst pipe, water loss ~500L/hr' },
    { _id: '5', location: 'Paltan Bazar', pipeline: 'Service Line P-22', severity: 'Medium', detectedDate: '2026-02-11', status: 'Under Repair' },
];

const mockDMAs: DMA[] = [
    { _id: '1', name: 'DMA-001 Kamakhya', area: 'Kamakhya', zone: 'Zone A', totalConnections: 1200, nrwPercent: 32, targetNrw: 20 },
    { _id: '2', name: 'DMA-002 Dispur', area: 'Dispur', zone: 'Zone B', totalConnections: 2800, nrwPercent: 25, targetNrw: 18 },
    { _id: '3', name: 'DMA-003 Jalukbari', area: 'Jalukbari', zone: 'Zone C', totalConnections: 950, nrwPercent: 41, targetNrw: 22 },
    { _id: '4', name: 'DMA-004 Panbazar', area: 'Panbazar', zone: 'Zone A', totalConnections: 1800, nrwPercent: 18, targetNrw: 15 },
];

export default function LeakageNRWPage() {
    const [tab, setTab] = useState<Tab>('detections');
    const [detections, setDetections] = useState(mockDetections);
    const [dmas, setDmas] = useState(mockDMAs);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();

    const onSubmitDetection = (data: any) => {
        setDetections(prev => [...prev, { _id: String(Date.now()), ...data, detectedDate: new Date().toISOString().split('T')[0] }]);
        setFormOpen(false); reset(); toast.success('Leak detection recorded');
    };

    const onSubmitDMA = (data: any) => {
        setDmas(prev => [...prev, { _id: String(Date.now()), ...data, totalConnections: Number(data.totalConnections), nrwPercent: Number(data.nrwPercent), targetNrw: Number(data.targetNrw) }]);
        setFormOpen(false); reset(); toast.success('DMA added');
    };

    const deleteItem = (id: string) => {
        if (tab === 'detections') setDetections(prev => prev.filter(d => d._id !== id));
        else setDmas(prev => prev.filter(d => d._id !== id));
        toast.success('Removed');
    };

    const openCases = detections.filter(d => d.status === 'Open').length;
    const avgNrw = dmas.length ? (dmas.reduce((s, d) => s + d.nrwPercent, 0) / dmas.length) : 0;

    const filteredDetections = detections.filter(d => d.location.toLowerCase().includes(searchTerm.toLowerCase()) || d.pipeline.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredDMAs = dmas.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.zone.toLowerCase().includes(searchTerm.toLowerCase()));

    const severityColor = (s: string) => {
        if (s === 'Critical') return 'badge-danger';
        if (s === 'High') return 'bg-orange-100 text-orange-700';
        if (s === 'Medium') return 'badge-warning';
        return 'badge-info';
    };

    const statusColor = (s: string) => {
        if (s === 'Resolved') return 'badge-success';
        if (s === 'Under Repair') return 'badge-warning';
        return 'badge-danger';
    };

    const nrwColor = (pct: number, target: number) => pct <= target ? 'text-emerald-600' : pct <= target * 1.5 ? 'text-amber-600' : 'text-red-600';

    const tabs = [
        { key: 'detections' as Tab, label: 'Detections', icon: AlertTriangle, count: detections.length },
        { key: 'dmas' as Tab, label: 'DMAs', icon: Target, count: dmas.length },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Detections" value={detections.length} subtitle={`${openCases} open cases`} icon={AlertTriangle} gradient="rose" variant="gradient" />
                <StatsCard title="Open Cases" value={openCases} subtitle="Require immediate action" icon={Activity} gradient="amber" variant="outlined" />
                <StatsCard title="Avg NRW" value={`${avgNrw.toFixed(1)}%`} subtitle="Non-Revenue Water" icon={Droplets} gradient="cyan" variant="flat" />
                <StatsCard title="Total DMAs" value={dmas.length} subtitle="District Metered Areas" icon={Target} gradient="purple" variant="outlined" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-6 pt-4 pb-0">
                    <div className="flex gap-1">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); setSearchTerm(''); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <t.icon className="w-4 h-4" /> {t.label}
                                <span className={`ml-1 text-xs px-2 py-0.5 rounded-md ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50/50 w-48 hover:border-gray-300 transition-all" />
                        </div>
                        <button onClick={() => { setFormOpen(true); reset(); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 text-sm transition-all">
                            <Plus className="w-4 h-4" /> Add {tab === 'detections' ? 'Detection' : 'DMA'}
                        </button>
                    </div>
                </div>

                {tab === 'detections' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Pipeline</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Detected</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDetections.map(d => (
                                    <tr key={d._id} className="table-row-hover">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-red-500" /></div>
                                                <span className="text-sm font-semibold text-gray-900">{d.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{d.pipeline}</td>
                                        <td className="px-6 py-4"><span className={`badge ${severityColor(d.severity)}`}>{d.severity}</span></td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{d.detectedDate}</td>
                                        <td className="px-6 py-4"><span className={`badge ${statusColor(d.status)}`}>{d.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteItem(d._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredDetections.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No detections found</div>}
                    </div>
                )}

                {tab === 'dmas' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">DMA Name</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Zone</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Connections</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">NRW %</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Target</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDMAs.map(d => (
                                    <tr key={d._id} className="table-row-hover">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{d.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{d.area}</td>
                                        <td className="px-6 py-4"><span className="badge badge-info">{d.zone}</span></td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.totalConnections.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${nrwColor(d.nrwPercent, d.targetNrw)}`}>{d.nrwPercent}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{d.targetNrw}%</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteItem(d._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredDMAs.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No DMAs found</div>}
                    </div>
                )}
            </div>

            {tab === 'detections' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Report Leak Detection" subtitle="Record a new leakage detection">
                    <form onSubmit={handleSubmit(onSubmitDetection)} className="space-y-2">
                        <FormSection title="Detection Details" icon={AlertTriangle}>
                            <FormField label="Location" required><input {...register('location', { required: true })} className={inputClass} placeholder="e.g. GNB Road, Km 2.3" /></FormField>
                            <FormField label="Pipeline" required hint="Which pipeline is affected"><input {...register('pipeline', { required: true })} className={inputClass} placeholder="e.g. Main Trunk Line A" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Severity" required>
                                    <select {...register('severity', { required: true })} className={selectClass}>
                                        <option value="">Select</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </FormField>
                                <FormField label="Status">
                                    <select {...register('status')} className={selectClass}>
                                        <option value="Open">Open</option>
                                        <option value="Under Repair">Under Repair</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="Description"><textarea {...register('description')} className={textareaClass} rows={3} placeholder="Describe the leakage..." /></FormField>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Detection</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}

            {tab === 'dmas' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add DMA" subtitle="Register a District Metered Area">
                    <form onSubmit={handleSubmit(onSubmitDMA)} className="space-y-2">
                        <FormSection title="DMA Details" icon={Target}>
                            <FormField label="DMA Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. DMA-005 Ulubari" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Area"><input {...register('area')} className={inputClass} placeholder="e.g. Ulubari" /></FormField>
                                <FormField label="Zone"><input {...register('zone')} className={inputClass} placeholder="e.g. Zone B" /></FormField>
                            </div>
                            <FormField label="Total Connections"><input type="number" {...register('totalConnections')} className={inputClass} placeholder="e.g. 1500" /></FormField>
                        </FormSection>
                        <FormSection title="NRW Metrics" icon={BarChart3}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Current NRW %" hint="Non-Revenue Water percentage"><input type="number" step="0.1" {...register('nrwPercent')} className={inputClass} placeholder="e.g. 28" /></FormField>
                                <FormField label="Target NRW %"><input type="number" step="0.1" {...register('targetNrw')} className={inputClass} placeholder="e.g. 20" /></FormField>
                            </div>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save DMA</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
        </div>
    );
}
