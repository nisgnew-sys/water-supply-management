import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, MapPin, Activity, Factory, Trash2, Edit3 } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface TreatmentPlant {
    _id: string; name: string; maxCapacityMld: number; location: { coordinates: number[] }; status: string; sourceId: { name: string } | null;
}
interface Source { _id: string; name: string; }

const STATUS_COLORS: Record<string, string> = { OPERATIONAL: '#22c55e', MAINTENANCE: '#f59e0b', SHUTDOWN: '#f43f5e' };

const MOCK_SOURCES: Source[] = [
    { _id: 'src-1', name: 'Brahmaputra River Intake – Pandu' },
    { _id: 'src-2', name: 'Deepor Beel Lake Intake' },
    { _id: 'src-3', name: 'Manas River Intake – Barpeta' },
    { _id: 'src-4', name: 'Dispur Borewell Cluster (12 wells)' },
    { _id: 'src-6', name: 'Dighalipukhuri Lake Intake – Jorhat' },
];

const MOCK_PLANTS: TreatmentPlant[] = [
    { _id: 'wtp-1', name: 'Pandu WTP (Conventional)', maxCapacityMld: 130, location: { coordinates: [91.7180, 26.1690] }, status: 'OPERATIONAL', sourceId: { name: 'Brahmaputra River Intake – Pandu' } },
    { _id: 'wtp-2', name: 'Deepor Beel WTP', maxCapacityMld: 22, location: { coordinates: [91.6560, 26.1280] }, status: 'OPERATIONAL', sourceId: { name: 'Deepor Beel Lake Intake' } },
    { _id: 'wtp-3', name: 'Barpeta WTP', maxCapacityMld: 35, location: { coordinates: [91.0050, 26.5020] }, status: 'OPERATIONAL', sourceId: { name: 'Manas River Intake – Barpeta' } },
    { _id: 'wtp-4', name: 'Dispur Borewell Package Plant', maxCapacityMld: 7.5, location: { coordinates: [91.7900, 26.1440] }, status: 'MAINTENANCE', sourceId: { name: 'Dispur Borewell Cluster (12 wells)' } },
    { _id: 'wtp-5', name: 'Jorhat WTP', maxCapacityMld: 10, location: { coordinates: [94.2180, 26.7500] }, status: 'OPERATIONAL', sourceId: { name: 'Dighalipukhuri Lake Intake – Jorhat' } },
];

export default function TreatmentPlantsPage() {
    const [plants, setPlants] = useState<TreatmentPlant[]>(MOCK_PLANTS);
    const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => { fetchPlants(); fetchSources(); }, []);

    const fetchPlants = async () => { try { const r = await api.get('/production/treatment-plants'); if (r.data && r.data.length > 0) setPlants(r.data); } catch (e) { console.error(e); } };
    const fetchSources = async () => { try { const r = await api.get('/production/sources'); if (r.data && r.data.length > 0) setSources(r.data); } catch (e) { console.error(e); } };

    const onSubmit = async (data: any) => {
        try {
            const payload = { ...data, maxCapacityMld: Number(data.maxCapacityMld), location: { coordinates: [Number(data.lng), Number(data.lat)] } };
            await api.post('/production/treatment-plants', payload);
            setIsFormOpen(false); reset(); fetchPlants();
            toast.success('Treatment plant added');
        } catch (e) { toast.error('Failed to create WTP'); }
    };

    const operational = plants.filter(p => p.status === 'OPERATIONAL').length;
    const totalCap = plants.reduce((s, p) => s + (p.maxCapacityMld || 0), 0);
    const statusData = Object.entries(plants.reduce((acc: Record<string, number>, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Infographic Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total WTPs" value={plants.length} subtitle="Treatment plants" icon={Factory} gradient="blue" />
                <StatsCard title="Operational" value={operational} subtitle={`${plants.length - operational} offline`} icon={Activity} gradient="green" />
                <StatsCard title="Total Capacity" value={`${totalCap.toFixed(1)} MLD`} subtitle="Combined capacity" icon={Factory} gradient="cyan" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status Distribution</p>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={80}>
                            <BarChart data={statusData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {statusData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <div />
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" /> Add Treatment Plant
                </button>
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {plants.map(plant => (
                    <div key={plant._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 card-interactive">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-base font-semibold text-gray-900">{plant.name}</h3>
                            <span className={`badge ${plant.status === 'OPERATIONAL' ? 'badge-success' : plant.status === 'MAINTENANCE' ? 'badge-warning' : 'badge-danger'}`}>{plant.status}</span>
                        </div>
                        {/* Capacity bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Capacity</span><span className="font-semibold text-gray-700">{plant.maxCapacityMld} MLD</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="h-2 rounded-full gradient-blue" style={{ width: `${Math.min((plant.maxCapacityMld / (totalCap || 1)) * 100 * plants.length, 100)}%` }} />
                            </div>
                        </div>
                        <div className="space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" />{plant.location?.coordinates?.join(', ')}</div>
                            <div className="flex items-center gap-2"><Factory className="w-3.5 h-3.5 text-gray-400" />Source: {plant.sourceId?.name || 'N/A'}</div>
                        </div>
                        <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                            <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Over Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Treatment Plant" subtitle="Register a new WTP">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormSection title="Basic Information" icon={Factory}>
                        <FormField label="WTP Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Guwahati WTP" /></FormField>
                        <FormField label="Source" required>
                            <select {...register('sourceId')} className={selectClass}><option value="">Select Source</option>{sources.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select>
                        </FormField>
                        <FormField label="Status" required>
                            <select {...register('status')} className={selectClass}><option value="OPERATIONAL">Operational</option><option value="MAINTENANCE">Maintenance</option><option value="SHUTDOWN">Shutdown</option></select>
                        </FormField>
                    </FormSection>
                    <FormSection title="Capacity & Location" icon={MapPin}>
                        <FormField label="Max Capacity (MLD)" required><input type="number" step="0.1" {...register('maxCapacityMld', { required: true })} className={inputClass} placeholder="50.0" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Latitude" required><input type="number" step="any" {...register('lat')} className={inputClass} placeholder="26.1445" /></FormField>
                            <FormField label="Longitude" required><input type="number" step="any" {...register('lng')} className={inputClass} placeholder="91.7362" /></FormField>
                        </div>
                        <FormField label="Technology Type" hint="Treatment technology used">
                            <select {...register('technologyType')} className={selectClass}><option value="CONVENTIONAL">Conventional</option><option value="STP">STP</option><option value="RO">Reverse Osmosis</option><option value="UV">UV Treatment</option></select>
                        </FormField>
                    </FormSection>
                    <FormSection title="Additional Details">
                        <FormField label="Remarks"><textarea {...register('remarks')} rows={2} className={textareaClass} placeholder="Any additional notes..." /></FormField>
                    </FormSection>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save WTP</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
