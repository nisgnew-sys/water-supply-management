import { useState } from 'react';
import { Gauge, Search, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MeterRecord {
    meterId: string; consumerId: string; consumerName: string; meterNo: string; lastReading: number;
    currentReading: number; consumption: number; readingDate: string; status: 'NORMAL' | 'HIGH_USAGE' | 'FAULTY' | 'TAMPERED';
}

const mockMeters: MeterRecord[] = [
    { meterId: 'M-001', consumerId: 'CON-101', consumerName: 'Rajesh Kumar Sharma', meterNo: 'MTR-45001', lastReading: 1250, currentReading: 1285, consumption: 35, readingDate: '2026-02-15', status: 'NORMAL' },
    { meterId: 'M-002', consumerId: 'CON-102', consumerName: 'Priya Devi Borah', meterNo: 'MTR-45021', lastReading: 890, currentReading: 920, consumption: 30, readingDate: '2026-02-15', status: 'NORMAL' },
    { meterId: 'M-003', consumerId: 'CON-103', consumerName: 'Assam Textiles Pvt Ltd', meterNo: 'MTR-45022', lastReading: 5600, currentReading: 6200, consumption: 600, readingDate: '2026-02-15', status: 'HIGH_USAGE' },
    { meterId: 'M-004', consumerId: 'CON-104', consumerName: 'Green Valley School', meterNo: 'MTR-45010', lastReading: 450, currentReading: 450, consumption: 0, readingDate: '2026-02-15', status: 'FAULTY' },
    { meterId: 'M-005', consumerId: 'CON-105', consumerName: 'Anand Shopping Mall', meterNo: 'MTR-45030', lastReading: 2100, currentReading: 2400, consumption: 300, readingDate: '2026-02-15', status: 'NORMAL' },
    { meterId: 'M-006', consumerId: 'CON-106', consumerName: 'Mohan Das', meterNo: 'MTR-45023', lastReading: 780, currentReading: 790, consumption: 10, readingDate: '2026-02-15', status: 'TAMPERED' },
];

const consumptionChart = [
    { range: '0-20', count: 45 }, { range: '21-50', count: 120 }, { range: '51-100', count: 85 },
    { range: '101-300', count: 40 }, { range: '300+', count: 12 },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
    NORMAL: { color: '#10b981', bg: '#ecfdf5' },
    HIGH_USAGE: { color: '#f59e0b', bg: '#fffbeb' },
    FAULTY: { color: '#ef4444', bg: '#fef2f2' },
    TAMPERED: { color: '#dc2626', bg: '#fef2f2' },
};

export default function MeteringPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const normal = mockMeters.filter(m => m.status === 'NORMAL').length;
    const faulty = mockMeters.filter(m => m.status === 'FAULTY' || m.status === 'TAMPERED').length;
    const totalConsumption = mockMeters.reduce((s, m) => s + m.consumption, 0);

    const filtered = mockMeters.filter(m => m.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) || m.meterNo.includes(searchTerm));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Meters" value={mockMeters.length} subtitle="Installed meters" icon={Gauge} gradient="blue" />
                <StatsCard title="Normal" value={normal} subtitle="Working properly" icon={CheckCircle2} gradient="green" variant="outlined" />
                <StatsCard title="Issues" value={faulty} subtitle="Faulty / tampered" icon={AlertTriangle} gradient="rose" variant="flat" />
                <StatsCard title="Total Usage" value={`${totalConsumption} KL`} subtitle="This billing cycle" icon={Activity} gradient="cyan" variant="outlined" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                {/* Meter Table */}
                <div>
                    <div style={{ marginBottom: '12px', position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                        <input type="text" placeholder="Search by name or meter no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '280px', outline: 'none' }} />
                    </div>
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                                    {['Meter No', 'Consumer', 'Last', 'Current', 'Usage (KL)', 'Date', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(m => {
                                    const sc = statusConfig[m.status];
                                    return (
                                        <tr key={m.meterId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600, color: '#374151' }}>{m.meterNo}</td>
                                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{m.consumerName}</td>
                                            <td style={{ padding: '10px 12px', color: '#6b7280' }}>{m.lastReading}</td>
                                            <td style={{ padding: '10px 12px', color: '#374151', fontWeight: 600 }}>{m.currentReading}</td>
                                            <td style={{ padding: '10px 12px', fontWeight: 700, color: m.consumption > 100 ? '#f59e0b' : '#111827' }}>{m.consumption}</td>
                                            <td style={{ padding: '10px 12px', color: '#6b7280' }}>{m.readingDate}</td>
                                            <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{m.status.replace('_', ' ')}</span></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Consumption Distribution */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>Consumption Distribution</h3>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 12px 0' }}>Kilolitres per billing cycle</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={consumptionChart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Consumers" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
