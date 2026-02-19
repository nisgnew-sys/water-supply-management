import { useState, useEffect } from 'react';
import api from '../lib/api';
import {
    Users, Droplets, IndianRupee, Wrench, AlertTriangle, ArrowRight, Factory, Database,
    TrendingUp, TrendingDown, ChevronDown, ChevronRight, MapPin, Gauge, Zap, ShieldAlert,
    CheckCircle2, Clock, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/ui/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadialBarChart, RadialBar, Legend
} from 'recharts';

interface DashboardStats {
    consumers: { total: number; active: number };
    revenue: { totalTarget: number; collected: number; pending: number };
    maintenance: { pendingTasks: number };
    waterSupply: { totalCapacityMLD: number };
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

/* ── Mock Data ── */
const mockMonthlyRevenue = [
    { month: 'Sep', collected: 42, target: 55 }, { month: 'Oct', collected: 48, target: 55 },
    { month: 'Nov', collected: 51, target: 58 }, { month: 'Dec', collected: 39, target: 58 },
    { month: 'Jan', collected: 56, target: 60 }, { month: 'Feb', collected: 44, target: 60 },
];
const mockConsumerCat = [
    { name: 'Residential', value: 65 }, { name: 'Commercial', value: 18 },
    { name: 'Industrial', value: 10 }, { name: 'Institutional', value: 7 },
];
const mockProductionTrend = [
    { month: 'Sep', produced: 120, treated: 115, supplied: 98 },
    { month: 'Oct', produced: 135, treated: 130, supplied: 110 },
    { month: 'Nov', produced: 142, treated: 138, supplied: 118 },
    { month: 'Dec', produced: 128, treated: 124, supplied: 105 },
    { month: 'Jan', produced: 150, treated: 146, supplied: 125 },
    { month: 'Feb', produced: 145, treated: 140, supplied: 120 },
];
const mockDistrictData = [
    { district: 'Kamrup Metro', connections: 45200, nrw: 18, revenue: 28.5, collectionRate: 82, supply: 85, demand: 92 },
    { district: 'Nagaon', connections: 18700, nrw: 24, revenue: 12.1, collectionRate: 74, supply: 32, demand: 38 },
    { district: 'Sonitpur', connections: 14500, nrw: 22, revenue: 9.8, collectionRate: 71, supply: 28, demand: 35 },
    { district: 'Dibrugarh', connections: 12800, nrw: 20, revenue: 8.4, collectionRate: 78, supply: 25, demand: 30 },
    { district: 'Jorhat', connections: 11200, nrw: 26, revenue: 7.2, collectionRate: 69, supply: 22, demand: 28 },
    { district: 'Cachar', connections: 9600, nrw: 28, revenue: 5.9, collectionRate: 65, supply: 18, demand: 25 },
    { district: 'Tinsukia', connections: 8900, nrw: 21, revenue: 5.5, collectionRate: 76, supply: 17, demand: 22 },
    { district: 'Barpeta', connections: 7400, nrw: 30, revenue: 4.1, collectionRate: 62, supply: 14, demand: 20 },
];
const mockNrwByZone = [
    { zone: 'Zone A', nrw: 15, pipes: 120 }, { zone: 'Zone B', nrw: 22, pipes: 95 },
    { zone: 'Zone C', nrw: 28, pipes: 85 }, { zone: 'Zone D', nrw: 18, pipes: 110 },
    { zone: 'Zone E', nrw: 32, pipes: 70 },
];
const mockSupplyHours = [
    { hour: '6AM', pressure: 2.8 }, { hour: '8AM', pressure: 2.2 }, { hour: '10AM', pressure: 1.9 },
    { hour: '12PM', pressure: 1.5 }, { hour: '2PM', pressure: 1.7 }, { hour: '4PM', pressure: 2.0 },
    { hour: '6PM', pressure: 2.4 }, { hour: '8PM', pressure: 2.6 }, { hour: '10PM', pressure: 2.9 },
];
const mockBillingStatus = [
    { name: 'Billed', value: 72 }, { name: 'Unbilled', value: 18 }, { name: 'Disputed', value: 10 },
];
const mockAssetHealth = [
    { name: 'Pumps', good: 42, fair: 8, poor: 3 },
    { name: 'Valves', good: 85, fair: 12, poor: 5 },
    { name: 'Meters', good: 320, fair: 45, poor: 18 },
    { name: 'Pipes (km)', good: 180, fair: 35, poor: 12 },
];
const mockAlerts = [
    { id: 1, severity: 'critical', message: 'Low pressure detected in Zone C — below 1.0 bar', time: '12 min ago', module: 'Distribution' },
    { id: 2, severity: 'warning', message: 'NRW exceeds 30% in Barpeta district', time: '45 min ago', module: 'Leakage' },
    { id: 3, severity: 'warning', message: 'WTP Nagaon operating at 92% capacity', time: '1 hr ago', module: 'Production' },
    { id: 4, severity: 'info', message: 'Revenue collection 8% below target this month', time: '2 hrs ago', module: 'Billing' },
    { id: 5, severity: 'critical', message: 'Pump #7 motor overheating — maintenance required', time: '3 hrs ago', module: 'Assets' },
    { id: 6, severity: 'info', message: '124 new consumer registrations this week', time: '5 hrs ago', module: 'Consumer' },
];
const mockActionPlan = [
    { id: 1, priority: 'high', action: 'Deploy leak detection team to Barpeta (NRW 30%)', owner: 'Distribution Dept', deadline: '18 Feb', status: 'pending' },
    { id: 2, priority: 'high', action: 'Replace Pump #7 motor at WTP Guwahati', owner: 'Maintenance Dept', deadline: '17 Feb', status: 'in-progress' },
    { id: 3, priority: 'medium', action: 'Increase Zone C supply hours to reduce pressure issues', owner: 'Operations Dept', deadline: '20 Feb', status: 'pending' },
    { id: 4, priority: 'medium', action: 'Initiate billing drives in low-collection districts', owner: 'Revenue Dept', deadline: '25 Feb', status: 'pending' },
    { id: 5, priority: 'low', action: 'Calibrate flow meters in Zone B (22% NRW)', owner: 'Maintenance Dept', deadline: '28 Feb', status: 'completed' },
];
const mockRadialEfficiency = [
    { name: 'Production', value: 92, fill: '#4f46e5' },
    { name: 'Treatment', value: 96, fill: '#06b6d4' },
    { name: 'Distribution', value: 78, fill: '#10b981' },
    { name: 'Billing', value: 74, fill: '#f59e0b' },
];

/* ── Reusable section card ── */
function SectionCard({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f8fafc' }}>
                <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
                    {subtitle && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>{subtitle}</p>}
                </div>
                {action}
            </div>
            <div style={{ padding: '14px 18px' }}>{children}</div>
        </div>
    );
}

export default function DashboardHome() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try { const r = await api.get('/analytics/dashboard'); setStats(r.data); }
        catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="shimmer" style={{ height: '80px', borderRadius: '12px' }} />)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                    <div className="shimmer" style={{ height: '220px', borderRadius: '12px' }} />
                    <div className="shimmer" style={{ height: '220px', borderRadius: '12px' }} />
                </div>
            </div>
        );
    }

    const totalConnections = mockDistrictData.reduce((s, d) => s + d.connections, 0);
    const avgNrw = (mockDistrictData.reduce((s, d) => s + d.nrw, 0) / mockDistrictData.length).toFixed(1);
    const totalRevenue = mockDistrictData.reduce((s, d) => s + d.revenue, 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* ═══ ROW 1: KPI Strip — 6 compact cards ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                <StatsCard title="Sources" value={stats?.waterSupply.totalCapacityMLD || 8} subtitle="Active sources" icon={Droplets} gradient="blue" />
                <StatsCard title="Production" value={`${145} MLD`} subtitle="Today's output" icon={Factory} gradient="cyan" variant="outlined" />
                <StatsCard title="NRW" value={`${avgNrw}%`} subtitle="Non-revenue water" icon={AlertTriangle} gradient="amber" variant="flat" />
                <StatsCard title="Connections" value={totalConnections.toLocaleString()} subtitle={`${stats?.consumers.active || 0} active`} icon={Users} gradient="green" />
                <StatsCard title="Revenue" value={`₹${totalRevenue.toFixed(0)}L`} subtitle={`₹${(stats?.revenue.pending || 0).toLocaleString()} pending`} icon={IndianRupee} gradient="purple" variant="outlined" />
                <StatsCard title="Maintenance" value={stats?.maintenance.pendingTasks || 12} subtitle="Pending tasks" icon={Wrench} gradient="rose" />
            </div>

            {/* ═══ ROW 2: Production-to-Supply Pipeline + System Efficiency ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <SectionCard title="Water Lifecycle — Production to Supply" subtitle="MLD trend over 6 months">
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={mockProductionTrend}>
                            <defs>
                                <linearGradient id="gProd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} /><stop offset="95%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient>
                                <linearGradient id="gTreat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.12} /><stop offset="95%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                                <linearGradient id="gSupply" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.12} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                            <Area type="monotone" dataKey="produced" stroke="#4f46e5" fill="url(#gProd)" strokeWidth={2} name="Produced" />
                            <Area type="monotone" dataKey="treated" stroke="#06b6d4" fill="url(#gTreat)" strokeWidth={2} name="Treated" />
                            <Area type="monotone" dataKey="supplied" stroke="#10b981" fill="url(#gSupply)" strokeWidth={2} name="Supplied" />
                        </AreaChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="System Efficiency" subtitle="Stage-wise performance">
                    <ResponsiveContainer width="100%" height={180}>
                        <RadialBarChart innerRadius="25%" outerRadius="95%" data={mockRadialEfficiency} startAngle={180} endAngle={0}>
                            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f1f5f9' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                        {mockRadialEfficiency.map(e => (
                            <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: e.fill }} />
                                <span style={{ color: '#6b7280' }}>{e.name}</span>
                                <span style={{ fontWeight: 700, color: '#111827', marginLeft: 'auto' }}>{e.value}%</span>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            </div>

            {/* ═══ ROW 3: District Drilldown Table + NRW by Zone ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' }}>
                <SectionCard title="District-wise Performance" subtitle="Click a row to drill down" action={<span style={{ fontSize: '10px', fontWeight: 600, color: '#6366f1', background: '#eef2ff', padding: '3px 10px', borderRadius: '6px' }}>{mockDistrictData.length} Districts</span>}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>District</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Connections</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>NRW %</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Revenue (₹L)</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Collection %</th>
                                    <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Supply Gap</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockDistrictData.map(d => (
                                    <>
                                        <tr key={d.district} onClick={() => setExpandedDistrict(expandedDistrict === d.district ? null : d.district)}
                                            style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {expandedDistrict === d.district ? <ChevronDown style={{ width: '12px', height: '12px', color: '#6366f1' }} /> : <ChevronRight style={{ width: '12px', height: '12px', color: '#9ca3af' }} />}
                                                {d.district}
                                            </td>
                                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#374151' }}>{d.connections.toLocaleString()}</td>
                                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                                <span style={{ color: d.nrw > 25 ? '#ef4444' : d.nrw > 20 ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{d.nrw}%</span>
                                            </td>
                                            <td style={{ padding: '8px 10px', textAlign: 'right', color: '#374151' }}>₹{d.revenue}</td>
                                            <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                                                    <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', borderRadius: '3px', width: `${d.collectionRate}%`, background: d.collectionRate > 75 ? '#10b981' : d.collectionRate > 65 ? '#f59e0b' : '#ef4444' }} />
                                                    </div>
                                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151' }}>{d.collectionRate}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>{d.demand - d.supply} MLD</span>
                                            </td>
                                        </tr>
                                        {expandedDistrict === d.district && (
                                            <tr key={`${d.district}-detail`}>
                                                <td colSpan={6} style={{ padding: '10px 10px 10px 32px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '11px' }}>
                                                        <div><span style={{ color: '#9ca3af' }}>Supply:</span> <strong>{d.supply} MLD</strong></div>
                                                        <div><span style={{ color: '#9ca3af' }}>Demand:</span> <strong>{d.demand} MLD</strong></div>
                                                        <div><span style={{ color: '#9ca3af' }}>Deficit:</span> <strong style={{ color: '#ef4444' }}>{d.demand - d.supply} MLD</strong></div>
                                                        <div><span style={{ color: '#9ca3af' }}>Coverage:</span> <strong>{((d.supply / d.demand) * 100).toFixed(0)}%</strong></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SectionCard>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <SectionCard title="NRW by Zone" subtitle="Non-Revenue Water %">
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={mockNrwByZone} layout="vertical" barSize={14}>
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 40]} />
                                <YAxis dataKey="zone" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={55} />
                                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                                <Bar dataKey="nrw" radius={[0, 6, 6, 0]} name="NRW %">
                                    {mockNrwByZone.map((entry, i) => <Cell key={i} fill={entry.nrw > 25 ? '#ef4444' : entry.nrw > 20 ? '#f59e0b' : '#10b981'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </SectionCard>

                    <SectionCard title="Consumer Distribution" subtitle="By category">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ResponsiveContainer width="45%" height={120}>
                                <PieChart>
                                    <Pie data={mockConsumerCat} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                                        {mockConsumerCat.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1 }}>
                                {mockConsumerCat.map((c, i) => (
                                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '11px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: COLORS[i] }} />
                                        <span style={{ color: '#6b7280', flex: 1 }}>{c.name}</span>
                                        <span style={{ fontWeight: 700, color: '#111827' }}>{c.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </SectionCard>
                </div>
            </div>

            {/* ═══ ROW 4: Revenue + Pressure Monitoring + Billing ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <SectionCard title="Revenue Collection" subtitle="Collected vs Target (₹ Lakhs)">
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={mockMonthlyRevenue} barGap={2} barSize={12}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            <Bar dataKey="collected" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Collected" />
                            <Bar dataKey="target" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Target" />
                        </BarChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="Pressure Monitoring" subtitle="Avg. pressure (bar) through the day">
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={mockSupplyHours}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 4]} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            <Line type="monotone" dataKey="pressure" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3, fill: '#06b6d4' }} name="Pressure (bar)" />
                            {/* Min threshold line */}
                            <Line type="monotone" dataKey={() => 1.5} stroke="#ef4444" strokeWidth={1} strokeDasharray="5 3" dot={false} name="Min Threshold" />
                        </LineChart>
                    </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="Billing Status" subtitle="Current month">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ResponsiveContainer width="45%" height={120}>
                            <PieChart>
                                <Pie data={mockBillingStatus} cx="50%" cy="50%" outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                                    {mockBillingStatus.map((_, i) => <Cell key={i} fill={[COLORS[2], COLORS[3], COLORS[4]][i]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ flex: 1 }}>
                            {mockBillingStatus.map((b, i) => (
                                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '12px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: [COLORS[2], COLORS[3], COLORS[4]][i] }} />
                                    <span style={{ color: '#6b7280', flex: 1 }}>{b.name}</span>
                                    <span style={{ fontWeight: 700, color: '#111827' }}>{b.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ═══ ROW 5: Alerts + Action Plan + Asset Health ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {/* Live Alerts */}
                <SectionCard title="Live Alerts" subtitle="System-wide notifications" action={<span style={{ fontSize: '10px', fontWeight: 600, color: '#ef4444', background: '#fef2f2', padding: '3px 10px', borderRadius: '6px' }}>{mockAlerts.filter(a => a.severity === 'critical').length} Critical</span>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                        {mockAlerts.map(a => (
                            <div key={a.id} style={{
                                display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', borderRadius: '8px', fontSize: '11px',
                                background: a.severity === 'critical' ? '#fef2f2' : a.severity === 'warning' ? '#fffbeb' : '#f0fdf4',
                                border: `1px solid ${a.severity === 'critical' ? '#fecaca' : a.severity === 'warning' ? '#fef08a' : '#bbf7d0'}`
                            }}>
                                <ShieldAlert style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '1px', color: a.severity === 'critical' ? '#ef4444' : a.severity === 'warning' ? '#f59e0b' : '#10b981' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, color: '#111827', fontWeight: 500, lineHeight: 1.3 }}>{a.message}</p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '3px', color: '#9ca3af', fontSize: '10px' }}>
                                        <span>{a.module}</span><span>·</span><span>{a.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Action Plan */}
                <SectionCard title="Recommended Actions" subtitle="Based on current system status" action={<span style={{ fontSize: '10px', fontWeight: 600, color: '#f59e0b', background: '#fffbeb', padding: '3px 10px', borderRadius: '6px' }}>{mockActionPlan.filter(a => a.status === 'pending').length} Pending</span>}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                        {mockActionPlan.map(a => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', borderRadius: '8px', background: '#f9fafb', border: '1px solid #f3f4f6', fontSize: '11px' }}>
                                {a.status === 'completed' ? <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
                                    : a.status === 'in-progress' ? <Clock style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
                                        : <XCircle style={{ width: '14px', height: '14px', color: '#9ca3af', flexShrink: 0, marginTop: '1px' }} />}
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, color: '#111827', fontWeight: 500, lineHeight: 1.3 }}>{a.action}</p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '3px', color: '#9ca3af', fontSize: '10px' }}>
                                        <span>{a.owner}</span><span>·</span><span>Due: {a.deadline}</span>
                                        <span style={{ marginLeft: 'auto', fontWeight: 600, color: a.priority === 'high' ? '#ef4444' : a.priority === 'medium' ? '#f59e0b' : '#10b981', textTransform: 'uppercase', fontSize: '9px' }}>{a.priority}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* Asset Health */}
                <SectionCard title="Asset Health Summary" subtitle="Equipment condition">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>Asset</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#10b981', fontSize: '10px' }}>Good</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#f59e0b', fontSize: '10px' }}>Fair</th>
                                <th style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700, color: '#ef4444', fontSize: '10px' }}>Poor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAssetHealth.map(a => (
                                <tr key={a.name} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>{a.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{a.good}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#f59e0b', fontWeight: 600 }}>{a.fair}</td>
                                    <td style={{ padding: '8px', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{a.poor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '10px' }}>
                        <ResponsiveContainer width="100%" height={80}>
                            <BarChart data={mockAssetHealth} barSize={10}>
                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                                <Bar dataKey="good" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="fair" stackId="a" fill="#f59e0b" />
                                <Bar dataKey="poor" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>

            {/* ═══ ROW 6: Quick Access Links ═══ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                {[
                    { name: 'Water Sources', href: '/dashboard/production/sources', icon: Droplets, bg: '#eef2ff', color: '#4f46e5' },
                    { name: 'Treatment Plants', href: '/dashboard/production/treatment-plants', icon: Factory, bg: '#ecfdf5', color: '#059669' },
                    { name: 'Distribution', href: '/dashboard/distribution/gis-network', icon: Database, bg: '#ecfeff', color: '#0891b2' },
                    { name: 'Consumers', href: '/dashboard/consumers', icon: Users, bg: '#f5f3ff', color: '#7c3aed' },
                    { name: 'Revenue', href: '/dashboard/finance/revenue', icon: IndianRupee, bg: '#fffbeb', color: '#d97706' },
                    { name: 'Assets', href: '/dashboard/assets', icon: Wrench, bg: '#fff1f2', color: '#e11d48' },
                ].map(link => (
                    <Link key={link.name} to={link.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', textDecoration: 'none', transition: 'box-shadow 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: link.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <link.icon style={{ width: '16px', height: '16px', color: link.color }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{link.name}</span>
                        <ArrowRight style={{ width: '14px', height: '14px', color: '#d1d5db', marginLeft: 'auto' }} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
