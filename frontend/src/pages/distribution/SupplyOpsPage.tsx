import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Edit3, Truck, Clock, MapPin, Activity, CalendarDays } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Tanker { _id: string; regNo: string; capacity: number; assignedZone: string; driver: string; status: string; }
interface Schedule { _id: string; zone: string; startTime: string; endTime: string; frequency: string; assignedAsset: string; type: string; status: string; }

type Tab = 'tankers' | 'schedules';

const mockTankers: Tanker[] = [
    { _id: '1', regNo: 'AS-01-AB-1234', capacity: 10000, assignedZone: 'Zone A', driver: 'Rahul Das', status: 'Active' },
    { _id: '2', regNo: 'AS-01-CD-5678', capacity: 15000, assignedZone: 'Zone B', driver: 'Amit Gogoi', status: 'Active' },
    { _id: '3', regNo: 'AS-01-EF-9012', capacity: 8000, assignedZone: 'Zone C', driver: 'Bijay Sharma', status: 'Under Maintenance' },
    { _id: '4', regNo: 'AS-01-GH-3456', capacity: 12000, assignedZone: 'Zone D', driver: 'Mohan Kalita', status: 'Active' },
];

const mockSchedules: Schedule[] = [
    { _id: '1', zone: 'Zone A', startTime: '06:00', endTime: '10:00', frequency: 'Daily', assignedAsset: 'Main Pipeline A', type: 'Pipeline', status: 'Active' },
    { _id: '2', zone: 'Zone B', startTime: '07:00', endTime: '11:00', frequency: 'Daily', assignedAsset: 'AS-01-CD-5678', type: 'Tanker', status: 'Active' },
    { _id: '3', zone: 'Zone C', startTime: '14:00', endTime: '18:00', frequency: 'Alternate Days', assignedAsset: 'AS-01-EF-9012', type: 'Tanker', status: 'Paused' },
    { _id: '4', zone: 'Zone D', startTime: '05:00', endTime: '09:00', frequency: 'Daily', assignedAsset: 'Trunk Line D', type: 'Pipeline', status: 'Active' },
    { _id: '5', zone: 'Zone A', startTime: '16:00', endTime: '20:00', frequency: 'Weekly', assignedAsset: 'AS-01-AB-1234', type: 'Tanker', status: 'Active' },
];

export default function SupplyOpsPage() {
    const [tab, setTab] = useState<Tab>('tankers');
    const [tankers, setTankers] = useState(mockTankers);
    const [schedules, setSchedules] = useState(mockSchedules);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();

    const onSubmitTanker = (data: any) => {
        setTankers(prev => [...prev, { _id: String(Date.now()), ...data, capacity: Number(data.capacity) }]);
        setFormOpen(false); reset(); toast.success('Tanker added');
    };

    const onSubmitSchedule = (data: any) => {
        setSchedules(prev => [...prev, { _id: String(Date.now()), ...data }]);
        setFormOpen(false); reset(); toast.success('Schedule added');
    };

    const deleteItem = (id: string) => {
        if (tab === 'tankers') setTankers(prev => prev.filter(t => t._id !== id));
        else setSchedules(prev => prev.filter(s => s._id !== id));
        toast.success('Removed');
    };

    const activeTankers = tankers.filter(t => t.status === 'Active').length;
    const activeSchedules = schedules.filter(s => s.status === 'Active').length;
    const totalCapacity = tankers.reduce((s, t) => s + t.capacity, 0);

    const filteredTankers = tankers.filter(t => t.regNo.toLowerCase().includes(searchTerm.toLowerCase()) || t.assignedZone.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredSchedules = schedules.filter(s => s.zone.toLowerCase().includes(searchTerm.toLowerCase()) || s.assignedAsset.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusColor = (s: string) => {
        if (['Active'].includes(s)) return 'badge-success';
        if (['Under Maintenance', 'Paused'].includes(s)) return 'badge-warning';
        return 'badge-danger';
    };

    const tabs = [
        { key: 'tankers' as Tab, label: 'Tankers', icon: Truck, count: tankers.length },
        { key: 'schedules' as Tab, label: 'Schedules', icon: Clock, count: schedules.length },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Tankers" value={tankers.length} subtitle={`${activeTankers} active`} icon={Truck} gradient="orange" variant="gradient" />
                <StatsCard title="Fleet Capacity" value={`${(totalCapacity / 1000).toFixed(0)} KL`} subtitle="Combined carrying capacity" icon={Activity} gradient="blue" variant="outlined" />
                <StatsCard title="Active Schedules" value={activeSchedules} subtitle={`of ${schedules.length} total`} icon={Clock} gradient="green" variant="flat" />
                <StatsCard title="Zones Covered" value={new Set(schedules.map(s => s.zone)).size} subtitle="Unique supply zones" icon={MapPin} gradient="purple" variant="outlined" />
            </div>

            {/* Tabs */}
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
                            <Plus className="w-4 h-4" /> Add {tab === 'tankers' ? 'Tanker' : 'Schedule'}
                        </button>
                    </div>
                </div>

                {/* Tankers Table */}
                {tab === 'tankers' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Registration</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity (L)</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Zone</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTankers.map(t => (
                                    <tr key={t._id} className="table-row-hover">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"><Truck className="w-4 h-4 text-orange-600" /></div>
                                                <span className="text-sm font-semibold text-gray-900">{t.regNo}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{t.capacity.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{t.assignedZone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{t.driver}</td>
                                        <td className="px-6 py-4"><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteItem(t._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTankers.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No tankers found</div>}
                    </div>
                )}

                {/* Schedules Table */}
                {tab === 'schedules' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Zone</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Frequency</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSchedules.map(s => (
                                    <tr key={s._id} className="table-row-hover">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{s.zone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{s.startTime} – {s.endTime}</td>
                                        <td className="px-6 py-4"><span className="badge badge-info">{s.frequency}</span></td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{s.assignedAsset}</td>
                                        <td className="px-6 py-4"><span className={`badge ${s.type === 'Tanker' ? 'badge-warning' : 'badge-info'}`}>{s.type}</span></td>
                                        <td className="px-6 py-4"><span className={`badge ${statusColor(s.status)}`}>{s.status}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteItem(s._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSchedules.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No schedules found</div>}
                    </div>
                )}
            </div>

            {/* Add Tanker Modal */}
            {tab === 'tankers' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Tanker" subtitle="Register a water tanker vehicle">
                    <form onSubmit={handleSubmit(onSubmitTanker)} className="space-y-2">
                        <FormSection title="Vehicle Details" icon={Truck}>
                            <FormField label="Registration Number" required><input {...register('regNo', { required: true })} className={inputClass} placeholder="e.g. AS-01-AB-1234" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Capacity (Litres)" required><input type="number" {...register('capacity', { required: true })} className={inputClass} placeholder="e.g. 10000" /></FormField>
                                <FormField label="Assigned Zone"><input {...register('assignedZone')} className={inputClass} placeholder="e.g. Zone A" /></FormField>
                            </div>
                            <FormField label="Driver Name"><input {...register('driver')} className={inputClass} placeholder="Driver name" /></FormField>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}>
                                    <option value="Active">Active</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </FormField>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Tanker</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}

            {/* Add Schedule Modal */}
            {tab === 'schedules' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Schedule" subtitle="Create a water supply schedule">
                    <form onSubmit={handleSubmit(onSubmitSchedule)} className="space-y-2">
                        <FormSection title="Schedule Details" icon={CalendarDays}>
                            <FormField label="Zone" required><input {...register('zone', { required: true })} className={inputClass} placeholder="e.g. Zone A" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Start Time" required><input type="time" {...register('startTime', { required: true })} className={inputClass} /></FormField>
                                <FormField label="End Time" required><input type="time" {...register('endTime', { required: true })} className={inputClass} /></FormField>
                            </div>
                            <FormField label="Frequency">
                                <select {...register('frequency')} className={selectClass}>
                                    <option value="Daily">Daily</option>
                                    <option value="Alternate Days">Alternate Days</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                </select>
                            </FormField>
                        </FormSection>
                        <FormSection title="Assignment" icon={Activity}>
                            <FormField label="Assigned Asset" hint="Name of tanker or pipeline"><input {...register('assignedAsset')} className={inputClass} placeholder="e.g. AS-01-AB-1234 or Main Pipeline A" /></FormField>
                            <FormField label="Type">
                                <select {...register('type')} className={selectClass}>
                                    <option value="Pipeline">Pipeline</option>
                                    <option value="Tanker">Tanker</option>
                                </select>
                            </FormField>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}>
                                    <option value="Active">Active</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </FormField>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Schedule</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
        </div>
    );
}
