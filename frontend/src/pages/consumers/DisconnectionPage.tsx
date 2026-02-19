import { useState } from 'react';
import { Power, PowerOff, Search, Clock, RotateCcw } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';

interface DCRequest {
    id: string; consumerId: string; consumerName: string; type: 'DISCONNECTION' | 'RECONNECTION';
    reason: string; status: 'REQUESTED' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
    requestDate: string; executionDate?: string; address: string;
}

const mockRequests: DCRequest[] = [
    { id: 'DC-001', consumerId: 'CON-104', consumerName: 'Green Valley School', type: 'DISCONNECTION', reason: 'Non-payment of dues (₹3,200 overdue)', status: 'APPROVED', requestDate: '2026-02-14', address: 'Ward 3, Jorhat' },
    { id: 'DC-002', consumerId: 'CON-107', consumerName: 'Ramesh Baruah', type: 'DISCONNECTION', reason: 'Consumer requested — relocating', status: 'EXECUTED', requestDate: '2026-02-10', executionDate: '2026-02-12', address: 'Ward 15, Guwahati' },
    { id: 'DC-003', consumerId: 'CON-108', consumerName: 'Hotel Paradise', type: 'RECONNECTION', reason: 'Dues cleared — ₹8,500 paid', status: 'REQUESTED', requestDate: '2026-02-15', address: 'Ward 2, Nagaon' },
    { id: 'DC-004', consumerId: 'CON-109', consumerName: 'Lakshmi Devi', type: 'RECONNECTION', reason: 'All pending bills settled + reconnection fee paid', status: 'APPROVED', requestDate: '2026-02-14', address: 'Ward 8, Dibrugarh' },
    { id: 'DC-005', consumerId: 'CON-110', consumerName: 'City Mart', type: 'DISCONNECTION', reason: 'Illegal connection detected — tampering with meter', status: 'EXECUTED', requestDate: '2026-02-08', executionDate: '2026-02-09', address: 'Ward 5, Tinsukia' },
    { id: 'DC-006', consumerId: 'CON-111', consumerName: 'Arun Gogoi', type: 'RECONNECTION', reason: 'Reconnection after seasonal absence', status: 'EXECUTED', requestDate: '2026-02-11', executionDate: '2026-02-13', address: 'Ward 11, Jorhat' },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
    REQUESTED: { color: '#6366f1', bg: '#eef2ff' }, APPROVED: { color: '#f59e0b', bg: '#fffbeb' },
    EXECUTED: { color: '#10b981', bg: '#ecfdf5' }, REJECTED: { color: '#ef4444', bg: '#fef2f2' },
};

export default function DisconnectionPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'DISCONNECTION' | 'RECONNECTION'>('ALL');
    const disconnections = mockRequests.filter(r => r.type === 'DISCONNECTION').length;
    const reconnections = mockRequests.filter(r => r.type === 'RECONNECTION').length;
    const pending = mockRequests.filter(r => r.status === 'REQUESTED' || r.status === 'APPROVED').length;

    const filtered = mockRequests.filter(r =>
        (filter === 'ALL' || r.type === filter) &&
        (r.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.includes(searchTerm))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Requests" value={mockRequests.length} subtitle="All records" icon={Power} gradient="blue" />
                <StatsCard title="Disconnections" value={disconnections} subtitle="Supply cut-off" icon={PowerOff} gradient="rose" variant="outlined" />
                <StatsCard title="Reconnections" value={reconnections} subtitle="Supply restored" icon={RotateCcw} gradient="green" variant="flat" />
                <StatsCard title="Pending" value={pending} subtitle="Awaiting execution" icon={Clock} gradient="amber" variant="outlined" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                        <input type="text" placeholder="Search requests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '260px', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        {(['ALL', 'DISCONNECTION', 'RECONNECTION'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{
                                padding: '7px 14px', fontSize: '11px', fontWeight: 600, border: 'none', cursor: 'pointer',
                                background: filter === f ? '#4f46e5' : '#fff', color: filter === f ? '#fff' : '#6b7280',
                            }}>{f === 'ALL' ? 'All' : f === 'DISCONNECTION' ? 'Disconnect' : 'Reconnect'}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['Request ID', 'Consumer', 'Address', 'Type', 'Reason', 'Request Date', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => {
                            const sc = statusConfig[r.status];
                            return (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#4f46e5' }}>{r.id}</td>
                                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{r.consumerName}</td>
                                    <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: '11px' }}>{r.address}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: r.type === 'DISCONNECTION' ? '#fef2f2' : '#ecfdf5', color: r.type === 'DISCONNECTION' ? '#ef4444' : '#10b981' }}>
                                            {r.type === 'DISCONNECTION' ? '⬇ Disconnect' : '⬆ Reconnect'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: '11px', maxWidth: '200px' }}>{r.reason}</td>
                                    <td style={{ padding: '10px 12px', color: '#6b7280' }}>{r.requestDate}</td>
                                    <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{r.status}</span></td>
                                    <td style={{ padding: '10px 12px' }}>
                                        {r.status === 'REQUESTED' && <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', cursor: 'pointer', color: '#4f46e5' }}>Approve</button>}
                                        {r.status === 'APPROVED' && <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', background: '#10b981', cursor: 'pointer', color: '#fff' }}>Execute</button>}
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
