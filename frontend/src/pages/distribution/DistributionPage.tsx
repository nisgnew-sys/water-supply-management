import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, Database, GaugeCircle, CircleDot, Map as MapIcon, Search, Trash2, Edit3, MapPin, Activity } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import GISMap from '../../components/GISMap';
import toast, { Toaster } from 'react-hot-toast';

interface Reservoir { _id: string; name: string; type: string; capacityML: number; zoneId: string; status: string; location: { coordinates: number[] }; }
interface Valve { _id: string; name: string; type: string; diameter: number; status: string; location: { coordinates: number[] }; }
interface Pipeline { _id: string; name: string; material: string; diameterMM: number; lengthKM: number; status: string; }

type Tab = 'reservoirs' | 'valves' | 'pipelines' | 'map';

export default function DistributionPage() {
    const [activeTab, setActiveTab] = useState<Tab>('reservoirs');
    const [reservoirs, setReservoirs] = useState<Reservoir[]>([]);
    const [valves, setValves] = useState<Valve[]>([]);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [formOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [mapMarkers, setMapMarkers] = useState<any[]>([]);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [r, v, p] = await Promise.all([
                api.get('/distribution/reservoirs'), api.get('/distribution/valves'), api.get('/distribution/pipelines')
            ]);
            setReservoirs(r.data); setValves(v.data); setPipelines(p.data);
            const markers = [
                ...r.data.map((x: any) => ({ ...x, type: 'RESERVOIR', position: [x.location?.coordinates?.[1], x.location?.coordinates?.[0]], title: x.name })),
                ...v.data.map((x: any) => ({ ...x, type: 'VALVE', position: [x.location?.coordinates?.[1], x.location?.coordinates?.[0]], title: x.name })),
            ];
            setMapMarkers(markers);
        } catch (e) { console.error(e); }
    };

    const onSubmitReservoir = async (data: any) => {
        try {
            await api.post('/distribution/reservoirs', { ...data, capacityML: Number(data.capacityML), location: { coordinates: [Number(data.lng), Number(data.lat)] } } as any);
            setFormOpen(false); reset(); fetchAll(); toast.success('Reservoir added');
        } catch (e) { toast.error('Failed to add reservoir'); }
    };
    const onSubmitValve = async (data: any) => {
        try {
            await api.post('/distribution/valves', { ...data, diameter: Number(data.diameter), location: { coordinates: [Number(data.lng), Number(data.lat)] } } as any);
            setFormOpen(false); reset(); fetchAll(); toast.success('Valve added');
        } catch (e) { toast.error('Failed to add valve'); }
    };
    const onSubmitPipeline = async (data: any) => {
        try {
            await api.post('/distribution/pipelines', { ...data, diameterMM: Number(data.diameterMM), lengthKM: Number(data.lengthKM) } as any);
            setFormOpen(false); reset(); fetchAll(); toast.success('Pipeline added');
        } catch (e) { toast.error('Failed to add pipeline'); }
    };

    const totalPipelineKm = pipelines.reduce((s, p) => s + (p.lengthKM || 0), 0);
    const tabs: { id: Tab; label: string; icon: any; count: number }[] = [
        { id: 'reservoirs', label: 'Reservoirs', icon: Database, count: reservoirs.length },
        { id: 'valves', label: 'Valves & Meters', icon: GaugeCircle, count: valves.length },
        { id: 'pipelines', label: 'Pipelines', icon: CircleDot, count: pipelines.length },
        { id: 'map', label: 'Network Map', icon: MapIcon, count: 0 },
    ];

    const getFormTitle = () => {
        if (activeTab === 'reservoirs') return 'Add Reservoir';
        if (activeTab === 'valves') return 'Add Valve / Meter';
        return 'Add Pipeline';
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Infographic Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Reservoirs" value={reservoirs.length} subtitle="GSR, ESR, MBR, SUMP" icon={Database} gradient="blue" />
                <StatsCard title="Valves & Meters" value={valves.length} subtitle="Active in network" icon={GaugeCircle} gradient="green" />
                <StatsCard title="Pipeline Network" value={`${totalPipelineKm.toFixed(1)} KM`} subtitle="Total network length" icon={CircleDot} gradient="cyan" />
                <StatsCard title="Active Assets" value={reservoirs.filter(r => r.status === 'OPERATIONAL').length + valves.filter(v => v.status === 'OPERATIONAL').length} subtitle="Operational count" icon={Activity} gradient="amber" />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-gray-100 p-1.5">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'gradient-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'}`}>{tab.count}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'map' ? (
                <div className="h-[500px] border rounded-xl overflow-hidden shadow-sm"><GISMap markers={mapMarkers} /></div>
            ) : (
                <>
                    {/* Search + Add */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                        </div>
                        <button onClick={() => { reset(); setFormOpen(true); }} className="gradient-blue text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">
                            <Plus className="w-4 h-4" /> {getFormTitle()}
                        </button>
                    </div>

                    {/* Reservoirs Table */}
                    {activeTab === 'reservoirs' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Capacity (ML)</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Zone</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reservoirs.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
                                        <tr key={r._id} className="table-row-hover">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                                            <td className="px-6 py-4"><span className="badge badge-info">{r.type}</span></td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{r.capacityML}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{r.zoneId || 'N/A'}</td>
                                            <td className="px-6 py-4"><span className={`badge ${r.status === 'OPERATIONAL' ? 'badge-success' : r.status === 'CLEANING' ? 'badge-warning' : 'badge-danger'}`}>{r.status}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {reservoirs.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No reservoirs found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Valves Table */}
                    {activeTab === 'valves' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Diameter (mm)</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {valves.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                        <tr key={v._id} className="table-row-hover">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{v.name}</td>
                                            <td className="px-6 py-4"><span className="badge badge-info">{v.type}</span></td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{v.diameter}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{v.location?.coordinates?.join(', ')}</td>
                                            <td className="px-6 py-4"><span className={`badge ${v.status === 'OPERATIONAL' ? 'badge-success' : 'badge-warning'}`}>{v.status}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {valves.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No valves found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pipelines Table */}
                    {activeTab === 'pipelines' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Material</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Diameter (mm)</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Length (KM)</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pipelines.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                        <tr key={p._id} className="table-row-hover">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                                            <td className="px-6 py-4"><span className="badge badge-neutral">{p.material}</span></td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{p.diameterMM}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{p.lengthKM}</td>
                                            <td className="px-6 py-4"><span className={`badge ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Edit3 className="w-4 h-4" /></button>
                                                <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pipelines.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No pipelines found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Slide Over Forms */}
            {activeTab === 'reservoirs' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Reservoir" subtitle="Register a new reservoir in the network">
                    <form onSubmit={handleSubmit(onSubmitReservoir)}>
                        <FormSection title="Reservoir Details" icon={Database}>
                            <FormField label="Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. North Zone ESR" /></FormField>
                            <FormField label="Type" required>
                                <select {...register('type')} className={selectClass}><option value="GSR">GSR (Ground Service Reservoir)</option><option value="ESR">ESR (Elevated Service Reservoir)</option><option value="MBR">MBR (Master Balancing Reservoir)</option><option value="SUMP">SUMP</option></select>
                            </FormField>
                            <FormField label="Capacity (ML)" required><input type="number" step="0.1" {...register('capacityML', { required: true })} className={inputClass} placeholder="e.g. 10.0" /></FormField>
                            <FormField label="Zone ID"><input {...register('zoneId')} className={inputClass} placeholder="Zone identifier" /></FormField>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}><option value="OPERATIONAL">Operational</option><option value="CLEANING">Cleaning</option><option value="REPAIR">Under Repair</option></select>
                            </FormField>
                        </FormSection>
                        <FormSection title="Location" icon={MapPin}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Latitude" required><input type="number" step="any" {...register('lat')} className={inputClass} placeholder="26.1445" /></FormField>
                                <FormField label="Longitude" required><input type="number" step="any" {...register('lng')} className={inputClass} placeholder="91.7362" /></FormField>
                            </div>
                        </FormSection>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save Reservoir</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
            {activeTab === 'valves' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Valve / Meter" subtitle="Register a new valve or meter">
                    <form onSubmit={handleSubmit(onSubmitValve)}>
                        <FormSection title="Valve Details" icon={GaugeCircle}>
                            <FormField label="Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Zone-A Gate Valve" /></FormField>
                            <FormField label="Type" required>
                                <select {...register('type')} className={selectClass}><option value="GATE_VALVE">Gate Valve</option><option value="BUTTERFLY_VALVE">Butterfly Valve</option><option value="FLOW_METER">Flow Meter</option><option value="PRESSURE_GAUGE">Pressure Gauge</option></select>
                            </FormField>
                            <FormField label="Diameter (mm)"><input type="number" {...register('diameter')} className={inputClass} placeholder="e.g. 200" /></FormField>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}><option value="OPERATIONAL">Operational</option><option value="FAULTY">Faulty</option><option value="CLOSED">Closed</option></select>
                            </FormField>
                        </FormSection>
                        <FormSection title="Location" icon={MapPin}>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Latitude" required><input type="number" step="any" {...register('lat')} className={inputClass} placeholder="26.1445" /></FormField>
                                <FormField label="Longitude" required><input type="number" step="any" {...register('lng')} className={inputClass} placeholder="91.7362" /></FormField>
                            </div>
                        </FormSection>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save Valve</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
            {activeTab === 'pipelines' && (
                <SlideOverPanel isOpen={formOpen} onClose={() => setFormOpen(false)} title="Add Pipeline" subtitle="Register a new pipeline segment">
                    <form onSubmit={handleSubmit(onSubmitPipeline)}>
                        <FormSection title="Pipeline Details" icon={CircleDot}>
                            <FormField label="Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Main Trunk Line - Zone A" /></FormField>
                            <FormField label="Material" required>
                                <select {...register('material')} className={selectClass}><option value="DI">Ductile Iron (DI)</option><option value="CI">Cast Iron (CI)</option><option value="HDPE">HDPE</option><option value="PVC">PVC</option><option value="GI">Galvanized Iron (GI)</option></select>
                            </FormField>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="Diameter (mm)" required><input type="number" {...register('diameterMM', { required: true })} className={inputClass} placeholder="e.g. 300" /></FormField>
                                <FormField label="Length (KM)" required><input type="number" step="0.1" {...register('lengthKM', { required: true })} className={inputClass} placeholder="e.g. 5.2" /></FormField>
                            </div>
                            <FormField label="Status">
                                <select {...register('status')} className={selectClass}><option value="ACTIVE">Active</option><option value="UNDER_REPAIR">Under Repair</option><option value="DECOMMISSIONED">Decommissioned</option></select>
                            </FormField>
                        </FormSection>
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save Pipeline</button>
                        </div>
                    </form>
                </SlideOverPanel>
            )}
        </div>
    );
}
