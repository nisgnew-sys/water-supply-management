import { useState } from 'react';
import { Zap, CheckCircle2, Clock, AlertTriangle, Search } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';

interface Activation {
    id: string; consumerId: string; consumerName: string; connectionSize: string; category: string;
    meterNo: string; activationDate: string; status: 'PENDING_METER' | 'METER_INSTALLED' | 'ACTIVATED' | 'FAILED';
    address: string;
}

const mockActivations: Activation[] = [
    { id: 'ACT-001', consumerId: 'CON-2026-101', consumerName: 'Priya Devi Borah', connectionSize: '½ inch', category: 'RESIDENTIAL', meterNo: 'MTR-45021', activationDate: '2026-02-16', status: 'ACTIVATED', address: 'Ward 5, Guwahati' },
    { id: 'ACT-002', consumerId: 'CON-2026-102', consumerName: 'Assam Textiles Pvt Ltd', connectionSize: '1½ inch', category: 'INDUSTRIAL', meterNo: 'MTR-45022', activationDate: '2026-02-17', status: 'METER_INSTALLED', address: 'Sector 4, Nagaon' },
    { id: 'ACT-003', consumerId: 'CON-2026-103', consumerName: 'Anand Shopping Mall', connectionSize: '1 inch', category: 'COMMERCIAL', meterNo: '-', activationDate: '-', status: 'PENDING_METER', address: 'Ward 1, Dibrugarh' },
    { id: 'ACT-004', consumerId: 'CON-2026-104', consumerName: 'Mohan Das', connectionSize: '½ inch', category: 'RESIDENTIAL', meterNo: 'MTR-45023', activationDate: '2026-02-15', status: 'ACTIVATED', address: 'Ward 9, Tinsukia' },
    { id: 'ACT-005', consumerId: 'CON-2026-105', consumerName: 'City Hospital', connectionSize: '1 inch', category: 'INSTITUTIONAL', meterNo: '-', activationDate: '-', status: 'FAILED', address: 'Ward 7, Jorhat' },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    PENDING_METER: { color: '#f59e0b', bg: '#fffbeb', label: 'Pending Meter' },
    METER_INSTALLED: { color: '#6366f1', bg: '#eef2ff', label: 'Meter Installed' },
    ACTIVATED: { color: '#10b981', bg: '#ecfdf5', label: 'Activated' },
    FAILED: { color: '#ef4444', bg: '#fef2f2', label: 'Failed' },
};

export default function ActivationPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const activated = mockActivations.filter(a => a.status === 'ACTIVATED').length;
    const pending = mockActivations.filter(a => a.status === 'PENDING_METER' || a.status === 'METER_INSTALLED').length;

    const filtered = mockActivations.filter(a => a.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.includes(searchTerm));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total" value={mockActivations.length} subtitle="Activation requests" icon={Zap} gradient="blue" />
                <StatsCard title="Activated" value={activated} subtitle="Live connections" icon={CheckCircle2} gradient="green" variant="outlined" />
                <StatsCard title="Pending" value={pending} subtitle="Awaiting meter/activation" icon={Clock} gradient="amber" variant="flat" />
                <StatsCard title="Failed" value={mockActivations.filter(a => a.status === 'FAILED').length} subtitle="Needs attention" icon={AlertTriangle} gradient="rose" variant="outlined" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input type="text" placeholder="Search activations..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '260px', outline: 'none' }} />
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['Activation ID', 'Consumer', 'Category', 'Connection', 'Meter No', 'Date', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => {
                            const sc = statusConfig[a.status];
                            return (
                                <tr key={a.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#4f46e5' }}>{a.id}</td>
                                    <td style={{ padding: '10px 14px' }}><div style={{ fontWeight: 600, color: '#111827' }}>{a.consumerName}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{a.address}</div></td>
                                    <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>{a.category}</span></td>
                                    <td style={{ padding: '10px 14px', color: '#374151' }}>{a.connectionSize}</td>
                                    <td style={{ padding: '10px 14px', color: '#374151', fontFamily: 'monospace' }}>{a.meterNo}</td>
                                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{a.activationDate}</td>
                                    <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{sc.label}</span></td>
                                    <td style={{ padding: '10px 14px' }}>
                                        {a.status === 'PENDING_METER' && <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', cursor: 'pointer', color: '#4f46e5' }}>Assign Meter</button>}
                                        {a.status === 'METER_INSTALLED' && <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', background: '#10b981', cursor: 'pointer', color: '#fff' }}>Activate</button>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
