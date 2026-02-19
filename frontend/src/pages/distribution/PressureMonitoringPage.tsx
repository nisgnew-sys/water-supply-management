import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Edit3, Gauge, Bell, Activity, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Sensor {
    _id: string; sensorId: string; location: string; pipeline: string;
    type: string; lastReading: number; unit: string; status: string; lastUpdated: string;
}
interface Alert {
    _id: string; sensorId: string; alertType: string; value: number;
    threshold: number; unit: string; timestamp: string; acknowledged: boolean; severity: string;
}

type Tab = 'sensors' | 'alerts';

const mockSensors: Sensor[] = [
    { _id: '1', sensorId: 'PS-001', location: 'Main Line Junction A', pipeline: 'Trunk Line A', type: 'Pressure', lastReading: 3.2, unit: 'bar', status: 'Online', lastUpdated: '2 min ago' },
    { _id: '2', sensorId: 'FS-001', location: 'WTP Outlet', pipeline: 'Trunk Line B', type: 'Flow', lastReading: 450, unit: 'L/min', status: 'Online', lastUpdated: '1 min ago' },
    { _id: '3', sensorId: 'PS-002', location: 'Zone B Entry', pipeline: 'Distribution Line B-5', type: 'Pressure', lastReading: 1.8, unit: 'bar', status: 'Warning', lastUpdated: '5 min ago' },
    { _id: '4', sensorId: 'FS-002', location: 'Reservoir Inlet', pipeline: 'Trunk Line C', type: 'Flow', lastReading: 680, unit: 'L/min', status: 'Online', lastUpdated: '30 sec ago' },
    { _id: '5', sensorId: 'PS-003', location: 'Zone D Dead-End', pipeline: 'Service Line D-12', type: 'Pressure', lastReading: 0.5, unit: 'bar', status: 'Offline', lastUpdated: '2 hrs ago' },
];

const mockAlerts: Alert[] = [
    { _id: '1', sensorId: 'PS-002', alertType: 'Low Pressure', value: 1.8, threshold: 2.0, unit: 'bar', timestamp: '2026-02-15 19:45', acknowledged: false, severity: 'High' },
    { _id: '2', sensorId: 'PS-003', alertType: 'Critically Low Pressure', value: 0.5, threshold: 1.0, unit: 'bar', timestamp: '2026-02-15 17:22', acknowledged: false, severity: 'Critical' },
    { _id: '3', sensorId: 'FS-001', alertType: 'High Flow', value: 520, threshold: 500, unit: 'L/min', timestamp: '2026-02-15 14:10', acknowledged: true, severity: 'Medium' },
    { _id: '4', sensorId: 'PS-001', alertType: 'Pressure Spike', value: 4.5, threshold: 4.0, unit: 'bar', timestamp: '2026-02-14 22:00', acknowledged: true, severity: 'High' },
];

export default function PressureMonitoringPage() {
    const [tab, setTab] = useState<Tab>('sensors');
    const [sensors, setSensors] = useState(mockSensors);
    const [alerts, setAlerts] = useState(mockAlerts);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();

    const onSubmitSensor = (data: any) => {
        setSensors(prev => [...prev, { _id: String(Date.now()), ...data, lastReading: Number(data.lastReading || 0), lastUpdated: 'Just now' }]);
        setFormOpen(false); reset(); toast.success('Sensor registered');
    };

    const onSubmitAlert = (data: any) => {
        setAlerts(prev => [...prev, { _id: String(Date.now()), ...data, value: Number(data.value), threshold: Number(data.threshold), timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16), acknowledged: false }]);
        setFormOpen(false); reset(); toast.success('Alert created');
    };

    const acknowledgeAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a._id === id ? { ...a, acknowledged: true } : a));
        toast.success('Alert acknowledged');
    };

    const deleteItem = (id: string) => {
        if (tab === 'sensors') setSensors(prev => prev.filter(s => s._id !== id));
        else setAlerts(prev => prev.filter(a => a._id !== id));
        toast.success('Removed');
    };

    const onlineSensors = sensors.filter(s => s.status === 'Online').length;
    const activeAlerts = alerts.filter(a => !a.acknowledged).length;
    const avgPressure = sensors.filter(s => s.type === 'Pressure').reduce((acc, s) => acc + s.lastReading, 0) / (sensors.filter(s => s.type === 'Pressure').length || 1);

    const filteredSensors = sensors.filter(s => s.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) || s.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredAlerts = alerts.filter(a => a.sensorId.toLowerCase().includes(searchTerm.toLowerCase()) || a.alertType.toLowerCase().includes(searchTerm.toLowerCase()));

    const sensorStatusColor = (s: string) => {
        if (s === 'Online') return 'badge-success';
        if (s === 'Warning') return 'badge-warning';
        return 'badge-danger';
    };

    const severityColor = (s: string) => {
        if (s === 'Critical') return 'badge-danger';
        if (s === 'High') return 'bg-orange-100 text-orange-700';
        if (s === 'Medium') return 'badge-warning';
        return 'badge-info';
    };

    const tabs = [
        { key: 'sensors' as Tab, label: 'Sensors', icon: Gauge, count: sensors.length },
        { key: 'alerts' as Tab, label: 'Alerts', icon: Bell, count: activeAlerts },
    ];

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Sensors" value={sensors.length} subtitle={`${onlineSensors} online`} icon={Wifi} gradient="blue" variant="gradient" />
                <StatsCard title="Active Alerts" value={activeAlerts} subtitle="Unacknowledged" icon={Bell} gradient="rose" variant="gradient" />
                <StatsCard title="Avg Pressure" value={`${avgPressure.toFixed(1)} bar`} subtitle="Pressure sensors" icon={Gauge} gradient="cyan" variant="outlined" />
                <StatsCard title="Uptime" value={`${sensors.length ? ((onlineSensors / sensors.length) * 100).toFixed(0) : 0}%`} subtitle="Sensor availability" icon={Activity} gradient="green" variant="flat" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between px-6 pt-4 pb-0">
                    <div className="flex gap-1">
                        {tabs.map(t => (
                            <button key={t.key} onClick={() => { setTab(t.key); setSearchTerm(''); }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <t.icon className="w-4 h-4" /> {t.label}
                                {t.key === 'alerts' && activeAlerts > 0 && (
                                    <span className="ml-1 text-xs px-2 py-0.5 rounded-md bg-red-100 text-red-700">{t.count}</span>
                                )}
                                {t.key === 'sensors' && (
                                    <span className={`ml-1 text-xs px-2 py-0.5 rounded-md ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
                                )}
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
                            <Plus className="w-4 h-4" /> Add {tab === 'sensors' ? 'Sensor' : 'Alert'}
                        </button>
                    </div>
                </div>

                {tab === 'sensors' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Sensor ID</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Pipeline</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Reading</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Updated</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSensors.map(s => (
                                    <tr key={s._id} className="table-row-hover">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${s.status === 'Online' ? 'bg-emerald-500 pulse-dot' : s.status === 'Warning' ? 'bg-amber-500 pulse-dot' : 'bg-gray-400'}`} />
                                                <span className="text-sm font-bold text-gray-900">{s.sensorId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{s.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{s.pipeline}</td>
                                        <td className="px-6 py-4"><span className={`badge ${s.type === 'Pressure' ? 'badge-info' : 'badge-neutral'}`}>{s.type}</span></td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{s.lastReading} {s.unit}</td>
                                        <td className="px-6 py-4"><span className={`badge ${sensorStatusColor(s.status)}`}>{s.status}</span></td>
                                        <td className="px-6 py-4 text-xs text-gray-400">{s.lastUpdated}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Edit3 className="w-4 h-4" /></button>
                                            <button onClick={() => deleteItem(s._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSensors.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No sensors found</div>}
                    </div>
                )}

                {tab === 'alerts' && (
                    <div className="overflow-x-auto mt-4">
                        <table className="w-full">
                            <thead><tr className="border-t border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Sensor</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Alert Type</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Threshold</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredAlerts.map(a => (
                                    <tr key={a._id} className={`table-row-hover ${!a.acknowledged ? 'bg-red-50/30' : ''}`}>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{a.sensorId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{a.alertType}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-red-600">{a.value} {a.unit}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{a.threshold} {a.unit}</td>
                                        <td className="px-6 py-4"><span className={`badge ${severityColor(a.severity)}`}>{a.severity}</span></td>
                                        <td className="px-6 py-4 text-xs text-gray-500">{a.timestamp}</td>
                                        <td className="px-6 py-4">
                                            {a.acknowledged ? (
                                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Ack</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs text-red-600 font-semibold"><AlertCircle className="w-3.5 h-3.5" /> Pending</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!a.acknowledged && (
                                                <button onClick={() => acknowledgeAlert(a._id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors mr-1">Acknowledge</button>
                                            )}
                                            <button onClick={() => deleteItem(a._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAlerts.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No alerts found</div>}
                    </div>
                )}
            </div>

            {tab === 'sensors' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Register Sensor" subtitle="Add a new pressure or flow sensor">
                    <form onSubmit={handleSubmit(onSubmitSensor)} className="space-y-2">
                        <FormSection title="Sensor Details" icon={Gauge}>
                            <FormField label="Sensor ID" required><input {...register('sensorId', { required: true })} className={inputClass} placeholder="e.g. PS-004" /></FormField>
                            <FormField label="Location" required><input {...register('location', { required: true })} className={inputClass} placeholder="e.g. Zone C Entry Point" /></FormField>
                            <FormField label="Pipeline" hint="Linked pipeline from GIS Network"><input {...register('pipeline')} className={inputClass} placeholder="e.g. Distribution Line C-3" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Type" required>
                                    <select {...register('type', { required: true })} className={selectClass}>
                                        <option value="">Select</option>
                                        <option value="Pressure">Pressure</option>
                                        <option value="Flow">Flow</option>
                                        <option value="Level">Level</option>
                                        <option value="Quality">Water Quality</option>
                                    </select>
                                </FormField>
                                <FormField label="Unit">
                                    <select {...register('unit')} className={selectClass}>
                                        <option value="bar">bar</option>
                                        <option value="psi">psi</option>
                                        <option value="L/min">L/min</option>
                                        <option value="m³/hr">m³/hr</option>
                                        <option value="m">m (level)</option>
                                    </select>
                                </FormField>
                            </div>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Warning">Warning</option>
                                </select>
                            </FormField>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Sensor</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}

            {tab === 'alerts' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Create Alert" subtitle="Manually create a monitoring alert">
                    <form onSubmit={handleSubmit(onSubmitAlert)} className="space-y-2">
                        <FormSection title="Alert Details" icon={Bell}>
                            <FormField label="Sensor ID" required><input {...register('sensorId', { required: true })} className={inputClass} placeholder="e.g. PS-002" /></FormField>
                            <FormField label="Alert Type" required><input {...register('alertType', { required: true })} className={inputClass} placeholder="e.g. Low Pressure" /></FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Measured Value" required><input type="number" step="0.1" {...register('value', { required: true })} className={inputClass} /></FormField>
                                <FormField label="Threshold"><input type="number" step="0.1" {...register('threshold')} className={inputClass} /></FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Unit"><input {...register('unit')} className={inputClass} placeholder="e.g. bar" /></FormField>
                                <FormField label="Severity">
                                    <select {...register('severity')} className={selectClass}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </FormField>
                            </div>
                        </FormSection>
                        <div className="pt-4">
                            <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Save Alert</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
        </div>
    );
}
