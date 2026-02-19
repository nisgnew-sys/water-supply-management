import { useState } from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, Download, Search } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

interface Bill {
    billNo: string; consumerId: string; consumerName: string; billDate: string; dueDate: string;
    amount: number; paid: number; status: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE'; category: string;
}

const mockBills: Bill[] = [
    { billNo: 'BILL-2026-0451', consumerId: 'CON-101', consumerName: 'Rajesh Kumar Sharma', billDate: '2026-02-01', dueDate: '2026-02-15', amount: 850, paid: 850, status: 'PAID', category: 'Residential' },
    { billNo: 'BILL-2026-0452', consumerId: 'CON-102', consumerName: 'Priya Devi Borah', billDate: '2026-02-01', dueDate: '2026-02-15', amount: 720, paid: 0, status: 'UNPAID', category: 'Residential' },
    { billNo: 'BILL-2026-0453', consumerId: 'CON-103', consumerName: 'Assam Textiles Pvt Ltd', billDate: '2026-02-01', dueDate: '2026-02-15', amount: 45000, paid: 20000, status: 'PARTIAL', category: 'Industrial' },
    { billNo: 'BILL-2026-0454', consumerId: 'CON-104', consumerName: 'Green Valley School', billDate: '2026-01-01', dueDate: '2026-01-15', amount: 3200, paid: 0, status: 'OVERDUE', category: 'Institutional' },
    { billNo: 'BILL-2026-0455', consumerId: 'CON-105', consumerName: 'Anand Shopping Mall', billDate: '2026-02-01', dueDate: '2026-02-15', amount: 12500, paid: 12500, status: 'PAID', category: 'Commercial' },
    { billNo: 'BILL-2026-0456', consumerId: 'CON-106', consumerName: 'Mohan Das', billDate: '2026-02-01', dueDate: '2026-02-15', amount: 480, paid: 200, status: 'PARTIAL', category: 'Residential' },
];

const monthlyCollection = [
    { month: 'Sep', billed: 28, collected: 22 }, { month: 'Oct', billed: 30, collected: 25 },
    { month: 'Nov', billed: 32, collected: 27 }, { month: 'Dec', billed: 29, collected: 20 },
    { month: 'Jan', billed: 35, collected: 30 }, { month: 'Feb', billed: 33, collected: 24 },
];

const paymentModes = [
    { name: 'Online', value: 45 }, { name: 'Cash', value: 25 }, { name: 'Cheque', value: 15 }, { name: 'UPI', value: 15 },
];
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4'];

const statusConfig: Record<string, { color: string; bg: string }> = {
    PAID: { color: '#10b981', bg: '#ecfdf5' }, PARTIAL: { color: '#f59e0b', bg: '#fffbeb' },
    UNPAID: { color: '#6366f1', bg: '#eef2ff' }, OVERDUE: { color: '#ef4444', bg: '#fef2f2' },
};

export default function BillingPaymentPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const totalBilled = mockBills.reduce((s, b) => s + b.amount, 0);
    const totalCollected = mockBills.reduce((s, b) => s + b.paid, 0);
    const overdue = mockBills.filter(b => b.status === 'OVERDUE').length;

    const filtered = mockBills.filter(b => b.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.billNo.includes(searchTerm));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Billed" value={`₹${(totalBilled / 1000).toFixed(1)}K`} subtitle="This cycle" icon={FileText} gradient="blue" />
                <StatsCard title="Collected" value={`₹${(totalCollected / 1000).toFixed(1)}K`} subtitle={`${((totalCollected / totalBilled) * 100).toFixed(0)}% collection rate`} icon={CheckCircle2} gradient="green" variant="outlined" />
                <StatsCard title="Outstanding" value={`₹${((totalBilled - totalCollected) / 1000).toFixed(1)}K`} subtitle="Pending amount" icon={Clock} gradient="amber" variant="flat" />
                <StatsCard title="Overdue" value={overdue} subtitle="Past due date" icon={AlertTriangle} gradient="rose" variant="outlined" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px' }}>
                {/* Collection Trend */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>Monthly Collection vs Billing</h3>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 12px 0' }}>₹ in Lakhs</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={monthlyCollection} barGap={2} barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            <Bar dataKey="billed" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Billed" />
                            <Bar dataKey="collected" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Collected" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Payment Modes */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>Payment Modes</h3>
                    <ResponsiveContainer width="100%" height={120}>
                        <PieChart><Pie data={paymentModes} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={2}>
                            {paymentModes.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Pie><Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} /></PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: '8px' }}>
                        {paymentModes.map((p, i) => (
                            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '11px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: COLORS[i] }} />
                                <span style={{ color: '#6b7280', flex: 1 }}>{p.name}</span>
                                <span style={{ fontWeight: 700, color: '#111827' }}>{p.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bills Table */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-8px' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input type="text" placeholder="Search bills..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '260px', outline: 'none' }} />
                </div>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['Bill No', 'Consumer', 'Category', 'Bill Date', 'Amount', 'Paid', 'Balance', 'Status', ''].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(b => {
                            const sc = statusConfig[b.status];
                            return (
                                <tr key={b.billNo} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#4f46e5' }}>{b.billNo}</td>
                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{b.consumerName}</td>
                                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>{b.category}</span></td>
                                    <td style={{ padding: '10px 12px', color: '#6b7280' }}>{b.billDate}</td>
                                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#111827' }}>₹{b.amount.toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px', color: '#10b981', fontWeight: 600 }}>₹{b.paid.toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px', color: b.amount - b.paid > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>₹{(b.amount - b.paid).toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{b.status}</span></td>
                                    <td style={{ padding: '10px 12px' }}><button style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#374151' }}><Download style={{ width: '12px', height: '12px' }} /></button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
