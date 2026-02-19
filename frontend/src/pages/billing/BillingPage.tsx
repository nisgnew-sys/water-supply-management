import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { IndianRupee, FileText, CreditCard, Search, Receipt, Eye } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Bill {
    _id: string; billMonth: string; amount: number; status: string; consumerId: { name: string; connectionId: string };
}

const STATUS_FILTERS = ['ALL', 'PENDING', 'PAID', 'OVERDUE'];
const STATUS_COLORS: Record<string, string> = { PAID: '#22c55e', PENDING: '#f59e0b', OVERDUE: '#f43f5e' };

const MOCK_BILLS: Bill[] = [
    { _id: 'b1', billMonth: '2025-12-01', amount: 1250, status: 'PAID', consumerId: { name: 'Rajesh Kumar Sharma', connectionId: 'CON-001' } },
    { _id: 'b2', billMonth: '2025-12-01', amount: 980, status: 'PAID', consumerId: { name: 'Ananya Borah', connectionId: 'CON-002' } },
    { _id: 'b3', billMonth: '2025-12-01', amount: 8500, status: 'PAID', consumerId: { name: 'Hotel Paradise', connectionId: 'CON-003' } },
    { _id: 'b4', billMonth: '2025-12-01', amount: 42000, status: 'PAID', consumerId: { name: 'Assam Textiles Ltd.', connectionId: 'CON-004' } },
    { _id: 'b5', billMonth: '2025-12-01', amount: 3200, status: 'PAID', consumerId: { name: 'GMC Primary School', connectionId: 'CON-005' } },
    { _id: 'b6', billMonth: '2025-12-01', amount: 1100, status: 'PAID', consumerId: { name: 'Sanjay Deka', connectionId: 'CON-006' } },
    { _id: 'b7', billMonth: '2026-01-01', amount: 1380, status: 'PAID', consumerId: { name: 'Rajesh Kumar Sharma', connectionId: 'CON-001' } },
    { _id: 'b8', billMonth: '2026-01-01', amount: 1050, status: 'PAID', consumerId: { name: 'Ananya Borah', connectionId: 'CON-002' } },
    { _id: 'b9', billMonth: '2026-01-01', amount: 9200, status: 'PENDING', consumerId: { name: 'Hotel Paradise', connectionId: 'CON-003' } },
    { _id: 'b10', billMonth: '2026-01-01', amount: 45600, status: 'PAID', consumerId: { name: 'Assam Textiles Ltd.', connectionId: 'CON-004' } },
    { _id: 'b11', billMonth: '2026-01-01', amount: 3500, status: 'PAID', consumerId: { name: 'GMC Primary School', connectionId: 'CON-005' } },
    { _id: 'b12', billMonth: '2026-01-01', amount: 12800, status: 'OVERDUE', consumerId: { name: 'City Mall Guwahati', connectionId: 'CON-008' } },
    { _id: 'b13', billMonth: '2026-02-01', amount: 1420, status: 'PENDING', consumerId: { name: 'Rajesh Kumar Sharma', connectionId: 'CON-001' } },
    { _id: 'b14', billMonth: '2026-02-01', amount: 1080, status: 'PENDING', consumerId: { name: 'Ananya Borah', connectionId: 'CON-002' } },
    { _id: 'b15', billMonth: '2026-02-01', amount: 9800, status: 'PENDING', consumerId: { name: 'Hotel Paradise', connectionId: 'CON-003' } },
    { _id: 'b16', billMonth: '2026-02-01', amount: 48200, status: 'PENDING', consumerId: { name: 'Assam Textiles Ltd.', connectionId: 'CON-004' } },
    { _id: 'b17', billMonth: '2026-02-01', amount: 15400, status: 'PENDING', consumerId: { name: 'GMCH Hospital', connectionId: 'CON-009' } },
    { _id: 'b18', billMonth: '2026-02-01', amount: 38500, status: 'PENDING', consumerId: { name: 'Barpeta Rice Mills', connectionId: 'CON-011' } },
];

function computeStats(data: Bill[]) {
    const total = data.reduce((a, c) => a + c.amount, 0);
    const pending = data.filter(b => b.status === 'PENDING' || b.status === 'OVERDUE').reduce((a, c) => a + c.amount, 0);
    return { totalRevenue: total, pendingAmount: pending, collectedAmount: total - pending };
}

export default function BillingPage() {
    const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState(computeStats(MOCK_BILLS));

    useEffect(() => { fetchBills(); }, []);

    const fetchBills = async () => {
        try {
            const r = await api.get('/billing/bills');
            if (r.data && r.data.length > 0) {
                setBills(r.data);
                setStats(computeStats(r.data));
            }
        } catch (e) { console.error(e); }
    };

    // Monthly aggregation for chart
    const monthlyData = bills.reduce((acc: Record<string, { month: string; collected: number; pending: number }>, b) => {
        const m = new Date(b.billMonth).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        if (!acc[m]) acc[m] = { month: m, collected: 0, pending: 0 };
        if (b.status === 'PAID') acc[m].collected += b.amount;
        else acc[m].pending += b.amount;
        return acc;
    }, {});
    const chartData = Object.values(monthlyData).slice(-6);

    // Status distribution for pie
    const statusDistro = bills.reduce((acc: Record<string, number>, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
    const pieData = Object.entries(statusDistro).map(([name, value]) => ({ name, value }));
    const PIE_COLORS = ['#22c55e', '#f59e0b', '#f43f5e', '#94a3b8'];

    const filtered = bills.filter(b =>
        (activeFilter === 'ALL' || b.status === activeFilter) &&
        (b.consumerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || !searchTerm)
    );

    const efficiency = stats.totalRevenue > 0 ? Math.round((stats.collectedAmount / stats.totalRevenue) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Billed" value={`₹${stats.totalRevenue.toLocaleString()}`} subtitle="All time billing" icon={IndianRupee} gradient="blue" />
                <StatsCard title="Collected" value={`₹${stats.collectedAmount.toLocaleString()}`} subtitle={`${efficiency}% collection rate`} icon={CreditCard} gradient="green" trend={{ value: `${efficiency}% efficiency`, positive: efficiency > 70 }} />
                <StatsCard title="Pending" value={`₹${stats.pendingAmount.toLocaleString()}`} subtitle="Outstanding dues" icon={FileText} gradient="rose" />
                <StatsCard title="Total Bills" value={bills.length} subtitle={`${bills.filter(b => b.status === 'OVERDUE').length} overdue`} icon={Receipt} gradient="amber" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Revenue Trend</h3>
                            <p className="text-xs text-gray-500">Collected vs Pending by month</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={chartData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                            <Bar dataKey="collected" fill="#22c55e" radius={[4, 4, 0, 0]} name="Collected" />
                            <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Bill Status</h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                                {pieData.map((entry, i) => <Cell key={i} fill={STATUS_COLORS[entry.name] || PIE_COLORS[i]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {pieData.map((entry, i) => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_COLORS[entry.name] || PIE_COLORS[i] }} />
                                <span className="text-gray-600 flex-1">{entry.name}</span>
                                <span className="font-semibold text-gray-700">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                    {STATUS_FILTERS.map(f => (
                        <button key={f} onClick={() => setActiveFilter(f)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeFilter === f ? 'gradient-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by consumer name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                </div>
            </div>

            {/* Bills Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Consumer</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Bill Month</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(bill => (
                            <tr key={bill._id} className="table-row-hover">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{bill.consumerId?.name || 'Unknown'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(bill.billMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{bill.amount?.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`badge ${bill.status === 'PAID' ? 'badge-success' : bill.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>{bill.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Eye className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No bills found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
