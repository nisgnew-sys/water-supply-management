import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, Search, Trash2, Edit3, CircleDot, GaugeCircle, Activity, MapPin, Ruler } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Pipeline { _id: string; name: string; material: string; diameterMM: number; lengthKM: number; status: string; connectedReservoirId?: string; zone?: string; }
interface Valve { _id: string; name: string; type: string; diameter: number; status: string; pipelineId?: string; location?: { coordinates: number[] }; }

type Tab = 'pipelines' | 'valves';

const MOCK_PIPELINES: Pipeline[] = [
    { _id: 'p1', name: 'Pandu – Dispur Trunk Main', material: 'DI', diameterMM: 600, lengthKM: 12.4, status: 'Active', zone: 'Zone A – Pandu' },
    { _id: 'p2', name: 'Dispur – Chandmari Distribution', material: 'HDPE', diameterMM: 300, lengthKM: 5.8, status: 'Active', zone: 'Zone B – Dispur' },
    { _id: 'p3', name: 'Chandmari – Panbazar Feeder', material: 'PVC', diameterMM: 200, lengthKM: 3.2, status: 'Active', zone: 'Zone C – Chandmari' },
    { _id: 'p4', name: 'Pandu – Kamakhya Rising Main', material: 'STEEL', diameterMM: 450, lengthKM: 4.1, status: 'Under Maintenance', zone: 'Zone A – Pandu' },
    { _id: 'p5', name: 'Barpeta WTP – Town Distribution', material: 'DI', diameterMM: 350, lengthKM: 8.6, status: 'Active', zone: 'Zone D – Barpeta' },
    { _id: 'p6', name: 'Deepor Beel – Six Mile Feeder', material: 'HDPE', diameterMM: 250, lengthKM: 6.3, status: 'Active', zone: 'Zone F – Deepor Beel' },
    { _id: 'p7', name: 'Jorhat Town Distribution Main', material: 'PVC', diameterMM: 200, lengthKM: 4.5, status: 'Active', zone: 'Zone E – Jorhat' },
    { _id: 'p8', name: 'Zoo Road Sub-Main', material: 'HDPE', diameterMM: 150, lengthKM: 2.1, status: 'Under Maintenance', zone: 'Zone C – Chandmari' },
];

const MOCK_VALVES: Valve[] = [
    { _id: 'v1', name: 'Pandu Trunk Main Sluice SV-001', type: 'Sluice', diameter: 600, status: 'Open', location: { coordinates: [91.7300, 26.1600] } },
    { _id: 'v2', name: 'Dispur Junction Air Valve AV-002', type: 'Air', diameter: 300, status: 'Open', location: { coordinates: [91.7850, 26.1450] } },
    { _id: 'v3', name: 'Chandmari NRV NR-003', type: 'Check', diameter: 200, status: 'Open', location: { coordinates: [91.7650, 26.1810] } },
    { _id: 'v4', name: 'Kamakhya Scour Valve SC-004', type: 'Gate', diameter: 450, status: 'Closed', location: { coordinates: [91.7060, 26.1645] } },
    { _id: 'v5', name: 'Barpeta Main Sluice SV-005', type: 'Sluice', diameter: 350, status: 'Open', location: { coordinates: [91.0080, 26.5035] } },
    { _id: 'v6', name: 'Deepor Beel Flow Meter FM-006', type: 'Butterfly', diameter: 250, status: 'Open', location: { coordinates: [91.6800, 26.1400] } },
    { _id: 'v7', name: 'Zoo Road Air Valve AV-007', type: 'Air', diameter: 150, status: 'Partially Open', location: { coordinates: [91.7680, 26.1780] } },
    { _id: 'v8', name: 'Jorhat NRV NR-008', type: 'Check', diameter: 200, status: 'Open', location: { coordinates: [94.2190, 26.7510] } },
    { _id: 'v9', name: 'Pandu CWR Outlet SV-009', type: 'Sluice', diameter: 600, status: 'Open', location: { coordinates: [91.7195, 26.1695] } },
    { _id: 'v10', name: 'Dispur–Chandmari PRV FM-010', type: 'PRV', diameter: 300, status: 'Maintenance', location: { coordinates: [91.7780, 26.1630] } },
];

export default function GISNetworkPage() {
    const [tab, setTab] = useState<Tab>('pipelines');
    const [pipelines, setPipelines] = useState<Pipeline[]>(MOCK_PIPELINES);
    const [valves, setValves] = useState<Valve[]>(MOCK_VALVES);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [p, v] = await Promise.all([api.get('/distribution/pipelines'), api.get('/distribution/valves')]);
            if (p.data && p.data.length > 0) setPipelines(p.data);
            if (v.data && v.data.length > 0) setValves(v.data);
        } catch (e) { console.error(e); }
    };

    const onSubmitPipeline = async (data: any) => {
        try {
            await api.post('/distribution/pipelines', { ...data, diameterMM: Number(data.diameterMM), lengthKM: Number(data.lengthKM) });
            setFormOpen(false); reset(); fetchAll(); toast.success('Pipeline added');
        } catch { toast.error('Failed to add pipeline'); }
    };

    const onSubmitValve = async (data: any) => {
        try {
            await api.post('/distribution/valves', {
                ...data, diameter: Number(data.diameter),
                location: data.lat && data.lng ? { coordinates: [Number(data.lng), Number(data.lat)] } : undefined
            });
            setFormOpen(false); reset(); fetchAll(); toast.success('Valve added');
        } catch { toast.error('Failed to add valve'); }
    };

    const totalKm = pipelines.reduce((s, p) => s + (p.lengthKM || 0), 0);
    const operationalPipes = pipelines.filter(p => p.status === 'Active' || p.status === 'Operational').length;
    const operationalValves = valves.filter(v => v.status === 'Open' || v.status === 'Operational').length;

    const filteredPipelines = pipelines.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.material?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredValves = valves.filter(v => v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || v.type?.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusColor = (s: string) => {
        if (['Active', 'Operational', 'Open'].includes(s)) return 'badge-success';
        if (['Maintenance', 'Under Maintenance', 'Partially Open'].includes(s)) return 'badge-warning';
        return 'badge-danger';
    };

    const tabs = [
        { key: 'pipelines' as Tab, label: 'Pipelines', icon: CircleDot, count: pipelines.length },
        { key: 'valves' as Tab, label: 'Valves', icon: GaugeCircle, count: valves.length },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Pipeline" value={`${totalKm.toFixed(1)} km`} subtitle={`${pipelines.length} segments`} icon={CircleDot} gradient="blue" variant="gradient" />
                <StatsCard title="Total Valves" value={valves.length} subtitle={`${operationalValves} operational`} icon={GaugeCircle} gradient="cyan" variant="outlined" />
                <StatsCard title="Network Health" value={`${pipelines.length ? ((operationalPipes / pipelines.length) * 100).toFixed(0) : 0}%`} subtitle="Pipeline operational rate" icon={Activity} gradient="green" variant="flat" />
                <StatsCard title="Avg Diameter" value={`${pipelines.length ? (pipelines.reduce((s, p) => s + p.diameterMM, 0) / pipelines.length).toFixed(0) : 0} mm`} subtitle="Average pipeline" icon={Ruler} gradient="purple" variant="outlined" />
            </div>

            {/* Tabs + Toolbar */}
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
                            <Plus className="w-4 h-4" /> Add {tab === 'pipelines' ? 'Pipeline' : 'Valve'}
                        </button>
                    </div>
                </div>

                {/* Pipeline Table */}
                {tab === 'pipelines' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Material</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Diameter</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Length</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredPipelines.map(p => (
                                    <tr key={p._id} className="table-row-hover">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.material}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.diameterMM} mm</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{p.lengthKM} km</td>
                                        <td className="px-6 py-4"><span className={`badge ${statusColor(p.status)}`}>{p.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPipelines.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No pipelines found</div>}
                    </div>
                )}

                {/* Valve Table */}
                {tab === 'valves' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Diameter</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredValves.map(v => (
                                    <tr key={v._id} className="table-row-hover">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{v.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{v.type}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{v.diameter} mm</td>
                                        <td className="px-6 py-4"><span className={`badge ${statusColor(v.status)}`}>{v.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredValves.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No valves found</div>}
                    </div>
                )}
            </div>

            {/* Add Pipeline Modal */}
            {tab === 'pipelines' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Pipeline" subtitle="Register a new pipeline in the GIS network">
                    <form onSubmit={handleSubmit(onSubmitPipeline)} className="space-y-2">
                        <FormSection title="Pipeline Details" icon={CircleDot}>
                            <FormField label="Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Main Trunk Line A" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Material" required>
                                    <select {...register('material', { required: true })} className={selectClass}>
                                        <option value="">Select</option>
                                        <option value="DI">Ductile Iron (DI)</option>
                                        <option value="HDPE">HDPE</option>
                                        <option value="PVC">PVC</option>
                                        <option value="MS">Mild Steel (MS)</option>
                                        <option value="CI">Cast Iron (CI)</option>
                                        <option value="GI">Galvanized Iron (GI)</option>
                                    </select>
                                </FormField>
                                <FormField label="Status">
                                    <select {...register('status')} className={selectClass}>
                                        <option value="Active">Active</option>
                                        <option value="Under Maintenance">Under Maintenance</option>
                                        <option value="Decommissioned">Decommissioned</option>
                                    </select>
                                </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Diameter (mm)" required><input type="number" {...register('diameterMM', { required: true })} className={inputClass} placeholder="e.g. 300" /></FormField>
                                <FormField label="Length (km)" required><input type="number" step="0.1" {...register('lengthKM', { required: true })} className={inputClass} placeholder="e.g. 2.5" /></FormField>
                            </div>
                        </FormSection>
                        <FormSection title="Connectivity" icon={Activity}>
                            <FormField label="Zone"><input {...register('zone')} className={inputClass} placeholder="e.g. Zone A" /></FormField>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Pipeline</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}

            {/* Add Valve Modal */}
            {tab === 'valves' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Valve" subtitle="Register a new valve in the GIS network">
                    <form onSubmit={handleSubmit(onSubmitValve)} className="space-y-2">
                        <FormSection title="Valve Details" icon={GaugeCircle}>
                            <FormField label="Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Main Gate Valve V-001" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Type" required>
                                    <select {...register('type', { required: true })} className={selectClass}>
                                        <option value="">Select</option>
                                        <option value="Gate">Gate Valve</option>
                                        <option value="Butterfly">Butterfly Valve</option>
                                        <option value="Check">Check Valve</option>
                                        <option value="PRV">Pressure Reducing Valve</option>
                                        <option value="Air">Air Valve</option>
                                        <option value="Sluice">Sluice Valve</option>
                                    </select>
                                </FormField>
                                <FormField label="Diameter (mm)"><input type="number" {...register('diameter')} className={inputClass} placeholder="e.g. 200" /></FormField>
                            </div>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}>
                                    <option value="Open">Open</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Partially Open">Partially Open</option>
                                    <option value="Maintenance">Under Maintenance</option>
                                </select>
                            </FormField>
                        </FormSection>
                        <FormSection title="Location" icon={MapPin}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Latitude"><input type="number" step="any" {...register('lat')} className={inputClass} /></FormField>
                                <FormField label="Longitude"><input type="number" step="any" {...register('lng')} className={inputClass} /></FormField>
                            </div>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Valve</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
        </div>
    );
}
