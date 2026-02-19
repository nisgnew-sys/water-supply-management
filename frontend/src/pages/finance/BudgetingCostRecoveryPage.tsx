import { useState } from 'react';
import { TrendingUp, Calculator, PiggyBank, BarChart3, Target, ArrowUpRight, Percent, CircleDollarSign } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const BUDGET_DATA = [
    { department: 'Production (WTPs)', allocated: 4500000, spent: 3680000, committed: 420000 },
    { department: 'Distribution Network', allocated: 3200000, spent: 2150000, committed: 680000 },
    { department: 'Consumer Services', allocated: 1800000, spent: 1420000, committed: 180000 },
    { department: 'Administration', allocated: 1200000, spent: 980000, committed: 80000 },
    { department: 'Capital Works', allocated: 8500000, spent: 5200000, committed: 1800000 },
    { department: 'IT & SCADA', allocated: 900000, spent: 560000, committed: 120000 },
];

const COST_RECOVERY = [
    { month: 'Sep', revenue: 3200000, opex: 2800000, ratio: 114 },
    { month: 'Oct', revenue: 3350000, opex: 2900000, ratio: 116 },
    { month: 'Nov', revenue: 3100000, opex: 2850000, ratio: 109 },
    { month: 'Dec', revenue: 3500000, opex: 3000000, ratio: 117 },
    { month: 'Jan', revenue: 3280000, opex: 2780000, ratio: 118 },
    { month: 'Feb', revenue: 3420000, opex: 2950000, ratio: 116 },
];

const OPEX_BREAKDOWN = [
    { month: 'Sep', chemicals: 845, electricity: 1250, labour: 420, maintenance: 285 },
    { month: 'Oct', chemicals: 890, electricity: 1180, labour: 450, maintenance: 380 },
    { month: 'Nov', chemicals: 820, electricity: 1300, labour: 410, maintenance: 320 },
    { month: 'Dec', chemicals: 870, electricity: 1150, labour: 480, maintenance: 500 },
    { month: 'Jan', chemicals: 810, electricity: 1200, labour: 430, maintenance: 340 },
    { month: 'Feb', chemicals: 850, electricity: 1280, labour: 440, maintenance: 380 },
];

export default function BudgetingCostRecoveryPage() {
    const [activeTab, setActiveTab] = useState<'budget' | 'recovery'>('budget');

    const totalAllocated = BUDGET_DATA.reduce((s, b) => s + b.allocated, 0);
    const totalSpent = BUDGET_DATA.reduce((s, b) => s + b.spent, 0);
    const totalCommitted = BUDGET_DATA.reduce((s, b) => s + b.committed, 0);
    const utilization = Math.round((totalSpent / totalAllocated) * 100);
    const avgOperatingRatio = Math.round(COST_RECOVERY.reduce((s, c) => s + c.ratio, 0) / COST_RECOVERY.length);

    const chartBudget = BUDGET_DATA.map(b => ({
        name: b.department.length > 16 ? b.department.substring(0, 16) + '…' : b.department,
        Allocated: b.allocated / 100000,
        Spent: b.spent / 100000,
        Committed: b.committed / 100000,
    }));

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Budget" value={`₹${(totalAllocated / 10000000).toFixed(1)}Cr`} subtitle={`FY 2025-26`} icon={PiggyBank} gradient="blue" />
                <StatsCard title="Budget Utilization" value={`${utilization}%`} subtitle={`₹${(totalSpent / 100000).toFixed(0)}L spent`} icon={Calculator} gradient="green" trend={{ value: `${utilization}%`, positive: utilization < 90 }} />
                <StatsCard title="Operating Ratio" value={`${avgOperatingRatio}%`} subtitle="Revenue covers operating cost" icon={Percent} gradient="cyan" trend={{ value: `>${100}% = surplus`, positive: avgOperatingRatio > 100 }} />
                <StatsCard title="Available" value={`₹${((totalAllocated - totalSpent - totalCommitted) / 100000).toFixed(1)}L`} subtitle="Remaining after committed" icon={CircleDollarSign} gradient="purple" />
            </div>

            {/* Tab Toggle */}
            <div className="flex gap-1 bg-white rounded-lg shadow-sm border border-gray-100 p-1 w-fit">
                <button onClick={() => setActiveTab('budget')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'budget' ? 'gradient-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Budget Tracking</span>
                </button>
                <button onClick={() => setActiveTab('recovery')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'recovery' ? 'gradient-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Cost Recovery</span>
                </button>
            </div>

            {activeTab === 'budget' && (
                <>
                    {/* Budget Bar Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Department-wise Budget Allocation vs Expenditure</h3>
                                <p className="text-xs text-gray-500">Values in ₹ Lakhs</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartBudget} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="Allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Spent" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Committed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Budget Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Allocated</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Spent</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Committed</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Available</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Utilization</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {BUDGET_DATA.map(b => {
                                    const available = b.allocated - b.spent - b.committed;
                                    const util = Math.round((b.spent / b.allocated) * 100);
                                    return (
                                        <tr key={b.department} className="table-row-hover">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">₹{(b.allocated / 100000).toFixed(1)}L</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{(b.spent / 100000).toFixed(1)}L</td>
                                            <td className="px-6 py-4 text-sm text-amber-600">₹{(b.committed / 100000).toFixed(1)}L</td>
                                            <td className="px-6 py-4 text-sm text-green-600 font-medium">₹{(available / 100000).toFixed(1)}L</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full" style={{ width: `${Math.min(util, 100)}%`, background: util > 90 ? '#ef4444' : util > 70 ? '#f59e0b' : '#22c55e' }} />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{util}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'recovery' && (
                <>
                    {/* Operating Ratio Trend */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">Revenue vs Operating Expenditure</h3>
                                <p className="text-xs text-gray-500">Monthly comparison (₹ Lakhs)</p>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={COST_RECOVERY.map(c => ({ ...c, revenue: c.revenue / 100000, opex: c.opex / 100000 }))} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                    <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
                                    <Bar dataKey="opex" fill="#f43f5e" radius={[4, 4, 0, 0]} name="OPEX" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">OPEX Breakdown Trend</h3>
                                <p className="text-xs text-gray-500">Operating cost components (₹ Thousands)</p>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={OPEX_BREAKDOWN}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    <Line type="monotone" dataKey="chemicals" stroke="#4f46e5" strokeWidth={2} name="Chemicals" dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="electricity" stroke="#f59e0b" strokeWidth={2} name="Electricity" dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="labour" stroke="#ec4899" strokeWidth={2} name="Labour" dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="maintenance" stroke="#22c55e" strokeWidth={2} name="Maintenance" dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operating Ratio Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-gray-400" /> Operating Ratio Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {COST_RECOVERY.map(c => (
                                <div key={c.month} className="text-center p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">{c.month} 2026</div>
                                    <div className={`text-xl font-bold ${c.ratio >= 100 ? 'text-green-600' : 'text-red-500'}`}>{c.ratio}%</div>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        {c.ratio >= 100 ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowUpRight className="w-3 h-3 text-red-500 rotate-90" />}
                                        <span className="text-[10px] text-gray-500">{c.ratio >= 100 ? 'Surplus' : 'Deficit'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
