import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, Search, Wrench, Activity, AlertTriangle, Edit3, Trash2, Eye, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface Asset {
    _id: string; name: string; type: string; model: string; serialNumber: string; status: string; facilityType: string;
}

const STATUS_COLORS: Record<string, string> = { OPERATIONAL: '#22c55e', UNDER_MAINTENANCE: '#f59e0b', FAULTY: '#f43f5e', SCRAPPED: '#94a3b8' };

const MOCK_ASSETS: Asset[] = [
    { _id: 'm1', name: 'Centrifugal Pump #1', type: 'PUMP', model: 'KSB Mega 80-250', serialNumber: 'KSB-2024-45021', status: 'OPERATIONAL', facilityType: 'WTP' },
    { _id: 'm2', name: 'Chlorination Unit CU-01', type: 'TREATMENT', model: 'Wallace & Tiernan V-10K', serialNumber: 'EVQ-2024-8801', status: 'OPERATIONAL', facilityType: 'WTP' },
    { _id: 'm3', name: 'Flow Meter FM-03', type: 'SENSOR', model: 'Endress+Hauser Promag W', serialNumber: 'EH-2024-FM03', status: 'UNDER_MAINTENANCE', facilityType: 'DISTRIBUTION' },
    { _id: 'm4', name: 'Butterfly Valve V-12', type: 'VALVE', model: 'Kirloskar BV-300', serialNumber: 'KBL-2023-V12', status: 'OPERATIONAL', facilityType: 'DISTRIBUTION' },
    { _id: 'm5', name: 'Diesel Generator DG-2', type: 'GENERATOR', model: 'Cummins C500D5', serialNumber: 'CUM-2024-DG02', status: 'OPERATIONAL', facilityType: 'WTP' },
    { _id: 'm6', name: 'Pressure Sensor PS-08', type: 'SENSOR', model: 'WIKA S-20', serialNumber: 'WK-2024-PS08', status: 'FAULTY', facilityType: 'DISTRIBUTION' },
    { _id: 'm7', name: 'Submersible Pump SP-05', type: 'PUMP', model: 'Grundfos SP 46-7', serialNumber: 'GF-2023-SP05', status: 'OPERATIONAL', facilityType: 'SOURCE' },
    { _id: 'm8', name: 'SCADA RTU Unit-3', type: 'SENSOR', model: 'Schneider SCADAPack 350', serialNumber: 'SE-2024-RTU03', status: 'SCRAPPED', facilityType: 'RESERVOIR' },
];

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    useEffect(() => { fetchAssets(); }, []);

    const fetchAssets = async () => {
        try {
            const r = await api.get('/assets');
            if (r.data && r.data.length > 0) setAssets(r.data);
        } catch (e) { console.error(e); }
    };

    const onSubmit = async (data: any) => {
        try {
            await api.post('/assets', data);
            setIsFormOpen(false); reset(); fetchAssets();
            toast.success('Asset registered');
        } catch (e) { toast.error('Failed to register asset'); }
    };

    const operational = assets.filter(a => a.status === 'OPERATIONAL').length;
    const faulty = assets.filter(a => a.status === 'FAULTY').length;
    const statusDistro = assets.reduce((acc: Record<string, number>, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
    const pieData = Object.entries(statusDistro).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    const filtered = assets.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Assets" value={assets.length} subtitle="Registered equipment" icon={Settings} gradient="blue" />
                <StatsCard title="Operational" value={operational} subtitle="Running normally" icon={Activity} gradient="green" />
                <StatsCard title="Faulty / Scrapped" value={faulty + assets.filter(a => a.status === 'SCRAPPED').length} subtitle="Needs attention" icon={AlertTriangle} gradient="rose" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status Overview</p>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={80}>
                            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} dataKey="value" paddingAngle={3}>{pieData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name.replace(' ', '_')] || '#94a3b8'} />)}</Pie><Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} /></PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                </div>
            </div>

            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by name, type, serial..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">
                    <Plus className="w-4 h-4" /> Register Asset
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Asset</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Model / Serial</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Facility</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(asset => (
                            <tr key={asset._id} className="table-row-hover">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{asset.name}</td>
                                <td className="px-6 py-4"><span className="badge badge-info">{asset.type}</span></td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">{asset.model}</div>
                                    <div className="text-xs text-gray-400">{asset.serialNumber}</div>
                                </td>
                                <td className="px-6 py-4"><span className="badge badge-neutral">{asset.facilityType}</span></td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${asset.status === 'OPERATIONAL' ? 'badge-success' : asset.status === 'UNDER_MAINTENANCE' ? 'badge-warning' : asset.status === 'FAULTY' ? 'badge-danger' : 'badge-neutral'}`}>
                                        {asset.status?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => navigate(`/dashboard/assets/${asset._id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Eye className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Edit3 className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No assets found</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Slide Over Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register Asset" subtitle="Add equipment to the asset register">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormSection title="Asset Information" icon={Wrench}>
                        <FormField label="Asset Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Pump Motor #12" /></FormField>
                        <FormField label="Type" required>
                            <select {...register('type')} className={selectClass}>
                                <option value="PUMP">Pump</option><option value="MOTOR">Motor</option><option value="VALVE">Valve</option>
                                <option value="SENSOR">Sensor</option><option value="GENERATOR">Generator</option><option value="TRANSFORMER">Transformer</option>
                            </select>
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Model" required><input {...register('model', { required: true })} className={inputClass} placeholder="Model number" /></FormField>
                            <FormField label="Serial Number" required><input {...register('serialNumber', { required: true })} className={inputClass} placeholder="Serial no." /></FormField>
                        </div>
                        <FormField label="Manufacturer"><input {...register('manufacturer')} className={inputClass} placeholder="e.g. Kirloskar, ABB" /></FormField>
                    </FormSection>

                    <FormSection title="Placement & Dates">
                        <FormField label="Facility Type" required>
                            <select {...register('facilityType')} className={selectClass}>
                                <option value="SOURCE">Source</option><option value="WTP">Treatment Plant</option>
                                <option value="RESERVOIR">Reservoir</option><option value="DISTRIBUTION">Distribution</option>
                            </select>
                        </FormField>
                        <FormField label="Facility ID" hint="ID of the source, WTP, or reservoir"><input {...register('facilityId')} className={inputClass} placeholder="Facility identifier" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Installation Date" required><input type="date" {...register('installationDate', { required: true })} className={inputClass} /></FormField>
                            <FormField label="Warranty Expiry"><input type="date" {...register('warrantyExpiry')} className={inputClass} /></FormField>
                        </div>
                        <FormField label="Purchase Cost (₹)"><input type="number" {...register('purchaseCost')} className={inputClass} placeholder="e.g. 150000" /></FormField>
                    </FormSection>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save Asset</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
