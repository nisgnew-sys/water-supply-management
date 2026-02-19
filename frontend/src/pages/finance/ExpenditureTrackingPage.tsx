import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Search, ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon, Target } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const MOCK_EXPENDITURES = [
    { id: 'EXP-001', category: 'Chemicals', vendor: 'Assam Chemical Suppliers', description: 'Chlorine gas & alum procurement – Q4', amount: 845000, date: '2026-01-15', status: 'PAID', facility: 'Pandu WTP' },
    { id: 'EXP-002', category: 'Electricity', vendor: 'APDCL', description: 'Electricity charges – pumping stations', amount: 1250000, date: '2026-01-20', status: 'PAID', facility: 'All Zones' },
    { id: 'EXP-003', category: 'Maintenance', vendor: 'KSB Pumps India', description: 'Pump overhaul – Centrifugal Pump #1', amount: 380000, date: '2026-02-01', status: 'PENDING', facility: 'Pandu WTP' },
    { id: 'EXP-004', category: 'Pipes & Fittings', vendor: 'Astral Poly Technik', description: 'HDPE pipes DN150 – Zoo Road replacement', amount: 520000, date: '2026-02-05', status: 'APPROVED', facility: 'Zone C – Chandmari' },
    { id: 'EXP-005', category: 'Labour', vendor: 'JJM Contractors', description: 'Pipeline laying contract – Barpeta Extension', amount: 1680000, date: '2026-02-08', status: 'PAID', facility: 'Zone D – Barpeta' },
    { id: 'EXP-006', category: 'Equipment', vendor: 'Grundfos India', description: 'Submersible pump SP 30-8 replacement', amount: 290000, date: '2026-02-10', status: 'PENDING', facility: 'Dispur Borewell' },
    { id: 'EXP-007', category: 'Chemicals', vendor: 'Assam Chemical Suppliers', description: 'PAC (Poly Aluminium Chloride) monthly order', amount: 420000, date: '2026-02-12', status: 'PAID', facility: 'Deepor Beel WTP' },
    { id: 'EXP-008', category: 'IT & Software', vendor: 'NISG', description: 'SCADA system annual maintenance contract', amount: 560000, date: '2026-02-14', status: 'APPROVED', facility: 'Central CCC' },
];

const UNIT_COSTS = [
    { month: 'Sep', production: 8.2, distribution: 3.1, admin: 1.5, total: 12.8 },
    { month: 'Oct', production: 8.5, distribution: 3.0, admin: 1.4, total: 12.9 },
    { month: 'Nov', production: 7.9, distribution: 3.2, admin: 1.6, total: 12.7 },
    { month: 'Dec', production: 8.1, distribution: 3.3, admin: 1.5, total: 12.9 },
    { month: 'Jan', production: 8.4, distribution: 3.1, admin: 1.4, total: 12.9 },
    { month: 'Feb', production: 8.0, distribution: 3.0, admin: 1.5, total: 12.5 },
];

const CATEGORY_COLORS: Record<string, string> = { Chemicals: '#4f46e5', Electricity: '#f59e0b', Maintenance: '#22c55e', 'Pipes & Fittings': '#06b6d4', Labour: '#ec4899', Equipment: '#8b5cf6', 'IT & Software': '#64748b' };
const STATUS_BADGE: Record<string, string> = { PAID: 'badge-success', PENDING: 'badge-warning', APPROVED: 'badge-info' };

export default function ExpenditureTrackingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState('ALL');

    const totalExpenditure = MOCK_EXPENDITURES.reduce((s, e) => s + e.amount, 0);
    const paidAmount = MOCK_EXPENDITURES.filter(e => e.status === 'PAID').reduce((s, e) => s + e.amount, 0);
    const pendingAmount = MOCK_EXPENDITURES.filter(e => e.status === 'PENDING').reduce((s, e) => s + e.amount, 0);

    const catDistro = MOCK_EXPENDITURES.reduce((acc: Record<string, number>, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
    const pieData = Object.entries(catDistro).map(([name, value]) => ({ name, value }));
    const categories = ['ALL', ...new Set(MOCK_EXPENDITURES.map(e => e.category))];

    const filtered = MOCK_EXPENDITURES.filter(e =>
        (filterCat === 'ALL' || e.category === filterCat) &&
        (e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Expenditure" value={`₹${(totalExpenditure / 100000).toFixed(1)}L`} subtitle="Current quarter" icon={DollarSign} gradient="blue" />
                <StatsCard title="Paid" value={`₹${(paidAmount / 100000).toFixed(1)}L`} subtitle={`${MOCK_EXPENDITURES.filter(e => e.status === 'PAID').length} transactions`} icon={TrendingUp} gradient="green" />
                <StatsCard title="Pending Payments" value={`₹${(pendingAmount / 100000).toFixed(1)}L`} subtitle="Awaiting clearance" icon={TrendingDown} gradient="rose" />
                <StatsCard title="Unit Cost (₹/KL)" value={`₹${UNIT_COSTS[UNIT_COSTS.length - 1].total}`} subtitle="Per kilolitre produced" icon={Target} gradient="purple" trend={{ value: '-3.1%', positive: true }} />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Unit Cost Trend */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Unit Cost Trend (₹/KL)</h3>
                            <p className="text-xs text-gray-500">Breakdown by cost component</p>
                        </div>
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={UNIT_COSTS}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="production" stroke="#4f46e5" strokeWidth={2} name="Production" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="distribution" stroke="#06b6d4" strokeWidth={2} name="Distribution" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="admin" stroke="#f59e0b" strokeWidth={2} name="Admin" dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2.5} name="Total" dot={{ r: 4 }} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Breakdown Pie */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><PieChartIcon className="w-4 h-4 text-gray-400" /> Expenditure by Category</h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                                {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />)}
                            </Pie>
                            <Tooltip formatter={((value: number) => `₹${(value / 1000).toFixed(0)}K`) as any} contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {pieData.map(entry => (
                            <div key={entry.name} className="flex items-center gap-2 text-xs">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[entry.name] || '#94a3b8' }} />
                                <span className="text-gray-600 flex-1">{entry.name}</span>
                                <span className="font-semibold text-gray-700">₹{(entry.value / 1000).toFixed(0)}K</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-100 p-1 flex-wrap">
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilterCat(c)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${filterCat === c ? 'gradient-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search vendor or description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                </div>
            </div>

            {/* Expenditure Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Vendor</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Facility</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(exp => (
                            <tr key={exp.id} className="table-row-hover">
                                <td className="px-6 py-4 text-sm font-mono text-gray-500">{exp.id}</td>
                                <td className="px-6 py-4"><span className="badge badge-info">{exp.category}</span></td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{exp.vendor}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{exp.description}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{exp.amount.toLocaleString()}</td>
                                <td className="px-6 py-4"><span className={`badge ${STATUS_BADGE[exp.status] || 'badge-info'}`}>{exp.status}</span></td>
                                <td className="px-6 py-4 text-sm text-gray-500">{exp.facility}</td>
                            </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No expenditures found</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
