import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';
import { Plus, Search, Users, Phone, UserCheck, UserX, Edit3, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

interface Consumer {
    _id: string; name: string; email: string; phone: string; address: string; category: string; isActive: boolean;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const MOCK_CONSUMERS: Consumer[] = [
    { _id: 'c1', name: 'Rajesh Kumar Sharma', email: 'rajesh.sharma@mail.com', phone: '9876543210', address: 'H.No. 12, Pandu Ward 1, Guwahati', category: 'RESIDENTIAL', isActive: true },
    { _id: 'c2', name: 'Ananya Borah', email: 'ananya.borah@mail.com', phone: '9876543211', address: 'Flat 4B, Dispur Apartments, Dispur', category: 'RESIDENTIAL', isActive: true },
    { _id: 'c3', name: 'Hotel Paradise', email: 'hotel.paradise@mail.com', phone: '9876543212', address: 'GS Road, Chandmari, Guwahati', category: 'COMMERCIAL', isActive: true },
    { _id: 'c4', name: 'Assam Textiles Ltd.', email: 'assam.textiles@mail.com', phone: '9876543213', address: 'Industrial Area, Barpeta Road', category: 'INDUSTRIAL', isActive: true },
    { _id: 'c5', name: 'GMC Primary School', email: 'gmc.school@mail.com', phone: '9876543214', address: 'Panbazar, Guwahati-01', category: 'INSTITUTIONAL', isActive: true },
    { _id: 'c6', name: 'Sanjay Deka', email: 'sanjay.deka@mail.com', phone: '9876543215', address: 'H.No. 45, Zoo Road, Guwahati', category: 'RESIDENTIAL', isActive: true },
    { _id: 'c7', name: 'Priya Kalita', email: 'priya.kalita@mail.com', phone: '9876543216', address: 'Jorhat Town, Ward 5', category: 'RESIDENTIAL', isActive: true },
    { _id: 'c8', name: 'City Mall Guwahati', email: 'citymall.ghy@mail.com', phone: '9876543217', address: 'Christian Basti, GS Road, Guwahati', category: 'COMMERCIAL', isActive: true },
    { _id: 'c9', name: 'GMCH Hospital', email: 'gmch.ghy@mail.com', phone: '9876543218', address: 'Bhangagarh, Guwahati', category: 'INSTITUTIONAL', isActive: true },
    { _id: 'c10', name: 'Dipak Baruah', email: 'dipak.baruah@mail.com', phone: '9876543219', address: 'Kamakhya Gate, Guwahati', category: 'RESIDENTIAL', isActive: false },
    { _id: 'c11', name: 'Barpeta Rice Mills', email: 'barpeta.ricemills@mail.com', phone: '9876543220', address: 'Barpeta Industrial Area', category: 'INDUSTRIAL', isActive: true },
    { _id: 'c12', name: 'Meera Hazarika', email: 'meera.hazarika@mail.com', phone: '9876543221', address: 'Six Mile, Guwahati', category: 'RESIDENTIAL', isActive: true },
];

export default function ConsumersPage() {
    const [consumers, setConsumers] = useState<Consumer[]>(MOCK_CONSUMERS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    useEffect(() => { fetchConsumers(); }, []);

    const fetchConsumers = async () => {
        try { const r = await api.get('/consumers'); if (r.data && r.data.length > 0) setConsumers(r.data); } catch (e) { console.error(e); }
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = { ...data, location: { coordinates: [Number(data.lng), Number(data.lat)] } };
            await api.post('/consumers', payload);
            setIsFormOpen(false); reset(); fetchConsumers();
            toast.success('Consumer registered successfully');
        } catch (e) { toast.error('Failed to register consumer'); }
    };

    const active = consumers.filter(c => c.isActive).length;
    const catDistro = consumers.reduce((acc: Record<string, number>, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {});
    const pieData = Object.entries(catDistro).map(([name, value]) => ({ name, value }));
    const filtered = consumers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Consumers" value={consumers.length} subtitle="Registered consumers" icon={Users} gradient="blue" />
                <StatsCard title="Active" value={active} subtitle={`${consumers.length - active} inactive`} icon={UserCheck} gradient="green" />
                <StatsCard title="Inactive" value={consumers.length - active} subtitle="Disconnected / dormant" icon={UserX} gradient="rose" />
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category Split</p>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={80}>
                            <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} dataKey="value" paddingAngle={3}>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} /></PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                </div>
            </div>

            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by name, email, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">
                    <Plus className="w-4 h-4" /> Register Consumer
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Consumer</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Address</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(c => (
                            <tr key={c._id} className="table-row-hover">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                                    <div className="text-xs text-gray-500">{c.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</td>
                                <td className="px-6 py-4"><span className="badge badge-info">{c.category}</span></td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{c.address}</td>
                                <td className="px-6 py-4"><span className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => navigate(`/dashboard/consumers/${c._id}`)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Eye className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 mr-1"><Edit3 className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No consumers found</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Slide Over Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register Consumer" subtitle="Add a new consumer to the system">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormSection title="Personal Information" icon={Users}>
                        <FormField label="Full Name" required><input {...register('name', { required: true })} className={inputClass} placeholder="Full name" /></FormField>
                        <FormField label="Father's / Guardian Name"><input {...register('fatherName')} className={inputClass} placeholder="Father or guardian name" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Email" required><input type="email" {...register('email', { required: true })} className={inputClass} placeholder="email@example.com" /></FormField>
                            <FormField label="Phone" required><input type="tel" {...register('phone', { required: true })} className={inputClass} placeholder="+91 XXXXX XXXXX" /></FormField>
                        </div>
                        <FormField label="Aadhaar Number" hint="12-digit Aadhaar for identity verification"><input {...register('aadhaar')} className={inputClass} placeholder="XXXX XXXX XXXX" /></FormField>
                    </FormSection>

                    <FormSection title="Address Details">
                        <FormField label="House / Plot No."><input {...register('houseNo')} className={inputClass} placeholder="House/Plot number" /></FormField>
                        <FormField label="Full Address" required><textarea {...register('address', { required: true })} rows={2} className={textareaClass} placeholder="Full address with landmark" /></FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Ward"><input {...register('ward')} className={inputClass} placeholder="Ward number" /></FormField>
                            <FormField label="District">
                                <select {...register('district')} className={selectClass}>
                                    <option value="">Select</option>
                                    <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
                                    <option value="Nagaon">Nagaon</option>
                                    <option value="Sonitpur">Sonitpur</option>
                                    <option value="Dibrugarh">Dibrugarh</option>
                                    <option value="Jorhat">Jorhat</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Latitude"><input type="number" step="any" {...register('lat')} className={inputClass} placeholder="26.1445" /></FormField>
                            <FormField label="Longitude"><input type="number" step="any" {...register('lng')} className={inputClass} placeholder="91.7362" /></FormField>
                        </div>
                    </FormSection>

                    <FormSection title="Connection Details">
                        <FormField label="Category" required>
                            <select {...register('category')} className={selectClass}><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="INDUSTRIAL">Industrial</option><option value="INSTITUTIONAL">Institutional</option></select>
                        </FormField>
                        <FormField label="Connection Type">
                            <select {...register('connectionType')} className={selectClass}><option value="METERED">Metered</option><option value="UNMETERED">Unmetered</option></select>
                        </FormField>
                        <FormField label="Meter Number"><input {...register('meterNumber')} className={inputClass} placeholder="Meter serial number" /></FormField>
                    </FormSection>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 gradient-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/20 hover:opacity-90">Save Consumer</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
