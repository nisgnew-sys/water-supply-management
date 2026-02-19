import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, MapPin, Search, Droplets, Activity, Trash2, Edit3 } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface Source {
    _id: string;
    name: string;
    type: string;
    maxCapacityMld: number;
    location: { coordinates: number[] };
    isActive: boolean;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const MOCK_SOURCES: Source[] = [
    { _id: 'src-1', name: 'Brahmaputra River Intake – Pandu', type: 'RIVER_INTAKE', maxCapacityMld: 130, location: { coordinates: [91.7195, 26.1700] }, isActive: true },
    { _id: 'src-2', name: 'Deepor Beel Lake Intake', type: 'LAKE', maxCapacityMld: 25, location: { coordinates: [91.6550, 26.1267] }, isActive: true },
    { _id: 'src-3', name: 'Manas River Intake – Barpeta', type: 'RIVER_INTAKE', maxCapacityMld: 40, location: { coordinates: [91.0000, 26.5000] }, isActive: true },
    { _id: 'src-4', name: 'Dispur Borewell Cluster (12 wells)', type: 'BOREWELL', maxCapacityMld: 8, location: { coordinates: [91.7898, 26.1445] }, isActive: true },
    { _id: 'src-5', name: 'Silsako Spring – Sonitpur', type: 'SPRING', maxCapacityMld: 3.5, location: { coordinates: [92.8000, 26.6300] }, isActive: false },
    { _id: 'src-6', name: 'Dighalipukhuri Lake Intake – Jorhat', type: 'LAKE', maxCapacityMld: 12, location: { coordinates: [94.2167, 26.7509] }, isActive: true },
];

export default function SourcesPage() {
    const [sources, setSources] = useState<Source[]>(MOCK_SOURCES);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => { fetchSources(); }, []);

    const fetchSources = async () => {
        try {
            const response = await api.get('/production/sources');
            if (response.data && response.data.length > 0) setSources(response.data);
        } catch (error) {
            console.error('Failed to fetch sources', error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                type: data.type,
                maxCapacityMld: Number(data.maxCapacityMld),
                location: { type: 'Point', coordinates: [Number(data.lng), Number(data.lat)] },
                isActive: true,
            };
            await api.post('/production/sources', payload);
            setIsFormOpen(false);
            reset();
            fetchSources();
            toast.success('Water source added successfully');
        } catch (error: any) {
            const msg = error?.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create source');
        }
    };

    const activeSources = sources.filter(s => s.isActive).length;
    const totalCapacity = sources.reduce((sum, s) => sum + (s.maxCapacityMld || 0), 0);
    const typeDistribution = sources.reduce((acc: Record<string, number>, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(typeDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    const filteredSources = sources.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Infographic Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Sources" value={sources.length} subtitle="Registered water sources" icon={Droplets} gradient="blue" />
                <StatsCard title="Active Sources" value={activeSources} subtitle={`${sources.length - activeSources} inactive`} icon={Activity} gradient="green" />
                <StatsCard title="Total Capacity" value={`${totalCapacity.toFixed(1)} MLD`} subtitle="Combined max capacity" icon={Droplets} gradient="cyan" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Source Types</p>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={80}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} dataKey="value" paddingAngle={3}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-4">No data</p>
                    )}
                </div>
            </div>

            {/* Header + Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search sources..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full"
                    />
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="gradient-blue text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Add Water Source
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source Name</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity (MLD)</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredSources.map(source => (
                            <tr key={source._id} className="table-row-hover">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{source.name}</td>
                                <td className="px-6 py-4">
                                    <span className="badge badge-info">{source.type?.replace('_', ' ')}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{source.maxCapacityMld}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    {source.location?.coordinates?.join(', ')}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${source.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {source.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors mr-1"><Edit3 className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {filteredSources.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No sources found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add Water Source" subtitle="Register a new water source in the system" icon={Droplets}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormSection title="Basic Information" icon={Droplets} columns={2}>
                        <FormField label="Source Name" required>
                            <input {...register('name', { required: true })} className={inputClass} placeholder="e.g. Brahmaputra River Intake" />
                        </FormField>
                        <FormField label="Source Type" required>
                            <select {...register('type')} className={selectClass}>
                                <option value="RIVER_INTAKE">River Intake</option>
                                <option value="BOREWELL">Borewell</option>
                                <option value="LAKE">Lake</option>
                                <option value="SPRING">Spring</option>
                            </select>
                        </FormField>
                        <div className="sm:col-span-2">
                            <FormField label="Description" hint="Brief description of the source">
                                <textarea {...register('description')} rows={2} className={textareaClass} placeholder="Additional details about the source..." />
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Capacity & Location" icon={MapPin} columns={2}>
                        <FormField label="Maximum Capacity (MLD)" required hint="Million Litres per Day">
                            <input type="number" step="0.1" {...register('maxCapacityMld', { required: true })} className={inputClass} placeholder="e.g. 50.0" />
                        </FormField>
                        <FormField label="District" hint="Assam district where source is located">
                            <select {...register('district')} className={selectClass}>
                                <option value="">Select District</option>
                                <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
                                <option value="Nagaon">Nagaon</option>
                                <option value="Sonitpur">Sonitpur</option>
                                <option value="Dibrugarh">Dibrugarh</option>
                                <option value="Jorhat">Jorhat</option>
                                <option value="Cachar">Cachar</option>
                                <option value="Tinsukia">Tinsukia</option>
                                <option value="Barpeta">Barpeta</option>
                            </select>
                        </FormField>
                        <FormField label="Latitude" required>
                            <input type="number" step="any" {...register('lat', { required: true })} className={inputClass} placeholder="26.1445" />
                        </FormField>
                        <FormField label="Longitude" required>
                            <input type="number" step="any" {...register('lng', { required: true })} className={inputClass} placeholder="91.7362" />
                        </FormField>
                    </FormSection>

                    <FormSection title="Contact & Notes" columns={2}>
                        <FormField label="Operator Name">
                            <input {...register('operatorName')} className={inputClass} placeholder="Name of responsible operator" />
                        </FormField>
                        <FormField label="Operator Phone">
                            <input type="tel" {...register('operatorPhone')} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                        </FormField>
                    </FormSection>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
                            Save Source
                        </button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
