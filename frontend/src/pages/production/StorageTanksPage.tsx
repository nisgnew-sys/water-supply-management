import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, Search, Trash2, Edit3, Database, Droplets, Factory, Activity, MapPin } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface StorageTank {
    _id: string; name: string; type: string; capacityML: number; zone: string;
    connectedSourceId?: string; connectedPlantId?: string; status: string;
    utilization?: number; location?: { coordinates: number[] };
}

interface Source { _id: string; name: string; }
interface Plant { _id: string; name: string; }

// Mock data — linked to same sources / WTPs used across the system
const MOCK_SOURCES: Source[] = [
    { _id: 'src-1', name: 'Brahmaputra River Intake – Pandu' },
    { _id: 'src-2', name: 'Deepor Beel Lake Intake' },
    { _id: 'src-3', name: 'Manas River Intake – Barpeta' },
    { _id: 'src-4', name: 'Dispur Borewell Cluster (12 wells)' },
    { _id: 'src-6', name: 'Dighalipukhuri Lake Intake – Jorhat' },
];

const MOCK_PLANTS: Plant[] = [
    { _id: 'wtp-1', name: 'Pandu WTP (Conventional)' },
    { _id: 'wtp-2', name: 'Deepor Beel WTP' },
    { _id: 'wtp-3', name: 'Barpeta WTP' },
    { _id: 'wtp-4', name: 'Dispur Borewell Package Plant' },
    { _id: 'wtp-5', name: 'Jorhat WTP' },
];

const mockTanks: StorageTank[] = [
    { _id: '1', name: 'Pandu CWR (Clear Water Reservoir)', type: 'CWR', capacityML: 18.0, zone: 'Zone A – Pandu', connectedSourceId: 'src-1', connectedPlantId: 'wtp-1', status: 'Operational', utilization: 82 },
    { _id: '2', name: 'Dispur OHT', type: 'OHT', capacityML: 5.0, zone: 'Zone B – Dispur', connectedSourceId: 'src-4', connectedPlantId: 'wtp-4', status: 'Operational', utilization: 71 },
    { _id: '3', name: 'Chandmari GSR', type: 'GSR', capacityML: 10.0, zone: 'Zone C – Chandmari', connectedSourceId: 'src-1', connectedPlantId: 'wtp-1', status: 'Operational', utilization: 65 },
    { _id: '4', name: 'Kamakhya ESR', type: 'ESR', capacityML: 3.5, zone: 'Zone A – Pandu', connectedSourceId: 'src-1', connectedPlantId: 'wtp-1', status: 'Under Maintenance', utilization: 0 },
    { _id: '5', name: 'Barpeta OHT', type: 'OHT', capacityML: 7.2, zone: 'Zone D – Barpeta', connectedSourceId: 'src-3', connectedPlantId: 'wtp-3', status: 'Operational', utilization: 88 },
    { _id: '6', name: 'Jorhat GSR', type: 'GSR', capacityML: 4.0, zone: 'Zone E – Jorhat', connectedSourceId: 'src-6', connectedPlantId: 'wtp-5', status: 'Operational', utilization: 58 },
    { _id: '7', name: 'Deepor Beel CWR', type: 'CWR', capacityML: 8.0, zone: 'Zone F – Deepor Beel', connectedSourceId: 'src-2', connectedPlantId: 'wtp-2', status: 'Inactive', utilization: 0 },
];

export default function StorageTanksPage() {
    const [tanks, setTanks] = useState<StorageTank[]>(mockTanks);
    const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
    const [plants, setPlants] = useState<Plant[]>(MOCK_PLANTS);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        // Fetch linked module data — override mocks if API returns data
        const fetchLinked = async () => {
            try {
                const [s, p] = await Promise.all([
                    api.get('/production/sources'),
                    api.get('/production/treatment-plants'),
                ]);
                if (s.data && s.data.length > 0) setSources(s.data);
                if (p.data && p.data.length > 0) setPlants(p.data);
            } catch (e) { console.error(e); }
        };
        fetchLinked();
    }, []);

    const onSubmit = (data: any) => {
        const newTank: StorageTank = {
            _id: String(Date.now()),
            name: data.name,
            type: data.type,
            capacityML: Number(data.capacityML),
            zone: data.zone,
            connectedSourceId: data.connectedSourceId,
            connectedPlantId: data.connectedPlantId,
            status: data.status || 'Operational',
            utilization: Math.floor(Math.random() * 80) + 20,
        };
        setTanks(prev => [...prev, newTank]);
        setFormOpen(false);
        reset();
        toast.success('Storage tank added');
    };

    const deleteTank = (id: string) => {
        setTanks(prev => prev.filter(t => t._id !== id));
        toast.success('Tank removed');
    };

    const filtered = tanks.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCapacity = tanks.reduce((s, t) => s + t.capacityML, 0);
    const operational = tanks.filter(t => t.status === 'Operational').length;
    const avgUtil = tanks.filter(t => t.utilization).reduce((s, t) => s + (t.utilization || 0), 0) / (operational || 1);

    const statusColor = (s: string) => {
        if (s === 'Operational') return 'badge-success';
        if (s === 'Under Maintenance') return 'badge-warning';
        return 'badge-danger';
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Tanks" value={tanks.length} subtitle="All types" icon={Database} gradient="blue" variant="gradient" />
                <StatsCard title="Total Capacity" value={`${totalCapacity.toFixed(1)} ML`} subtitle="Combined storage" icon={Droplets} gradient="cyan" variant="outlined" />
                <StatsCard title="Operational" value={`${operational}/${tanks.length}`} subtitle={`${((operational / tanks.length) * 100).toFixed(0)}% uptime`} icon={Activity} gradient="green" variant="flat" />
                <StatsCard title="Avg Utilization" value={`${avgUtil.toFixed(0)}%`} subtitle="Across operational tanks" icon={Factory} gradient="purple" variant="outlined" />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search tanks or zones..."
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 hover:border-gray-300 w-full transition-all"
                    />
                </div>
                <button onClick={() => setFormOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all text-sm">
                    <Plus className="w-4 h-4" /> Add Tank
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Capacity (ML)</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Zone</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilization</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(tank => (
                                <tr key={tank._id} className="table-row-hover">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                <Database className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{tank.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{tank.type}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tank.capacityML}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{tank.zone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${tank.utilization || 0}%` }} />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600">{tank.utilization || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`badge ${statusColor(tank.status)}`}>{tank.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => deleteTank(tank._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No storage tanks found</div>}
            </div>

            {/* Add Tank Modal */}
            <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Storage Tank" subtitle="Register a new storage tank linked to source and plant">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <FormSection title="Tank Details" icon={Database}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tank Name" required>
                                <input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Kamakhya OHT" />
                            </FormField>
                            <FormField label="Type" required>
                                <select {...register('type', { required: true })} className={selectClass}>
                                    <option value="">Select type</option>
                                    <option value="OHT">Overhead Tank (OHT)</option>
                                    <option value="GSR">Ground Service Reservoir (GSR)</option>
                                    <option value="ESR">Elevated Service Reservoir (ESR)</option>
                                    <option value="CWR">Clear Water Reservoir (CWR)</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Capacity (ML)" required>
                                <input type="number" step="0.1" {...register('capacityML', { required: true })} className={inputClass} placeholder="e.g. 5.0" />
                            </FormField>
                            <FormField label="Zone">
                                <input {...register('zone')} className={inputClass} placeholder="e.g. Zone A" />
                            </FormField>
                        </div>
                        <FormField label="Status">
                            <select {...register('status')} className={selectClass}>
                                <option value="Operational">Operational</option>
                                <option value="Under Maintenance">Under Maintenance</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </FormField>
                    </FormSection>

                    <FormSection title="Linked Modules" icon={Activity}>
                        <FormField label="Connected Water Source" hint="Links this tank to a source for traceability">
                            <select {...register('connectedSourceId')} className={selectClass}>
                                <option value="">-- Select source --</option>
                                {sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Connected Treatment Plant" hint="Links this tank to its upstream treatment plant">
                            <select {...register('connectedPlantId')} className={selectClass}>
                                <option value="">-- Select plant --</option>
                                {plants.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </FormField>
                    </FormSection>

                    <FormSection title="Location" icon={MapPin}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Latitude">
                                <input type="number" step="any" {...register('lat')} className={inputClass} placeholder="e.g. 26.1445" />
                            </FormField>
                            <FormField label="Longitude">
                                <input type="number" step="any" {...register('lng')} className={inputClass} placeholder="e.g. 91.7362" />
                            </FormField>
                        </div>
                    </FormSection>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">
                            Save Storage Tank
                        </button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
