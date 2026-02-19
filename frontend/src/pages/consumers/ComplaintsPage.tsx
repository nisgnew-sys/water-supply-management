import { useState } from 'react';
import { MessageSquare, Plus, CheckCircle2, Clock, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Complaint {
    id: string; consumerId: string; consumerName: string; category: string; description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    createdDate: string; resolvedDate?: string; assignedTo?: string;
}

const mockComplaints: Complaint[] = [
    { id: 'CMP-001', consumerId: 'CON-101', consumerName: 'Rajesh Kumar Sharma', category: 'No Water Supply', description: 'No water in taps since 2 days. Ward 12, MG Road area.', status: 'OPEN', priority: 'HIGH', createdDate: '2026-02-15' },
    { id: 'CMP-002', consumerId: 'CON-102', consumerName: 'Priya Devi Borah', category: 'Low Pressure', description: 'Very low pressure, water barely comes to 1st floor.', status: 'IN_PROGRESS', priority: 'MEDIUM', createdDate: '2026-02-14', assignedTo: 'Mr. Kalita' },
    { id: 'CMP-003', consumerId: 'CON-103', consumerName: 'Assam Textiles', category: 'Water Quality', description: 'Yellowish water with bad smell in morning hours.', status: 'IN_PROGRESS', priority: 'CRITICAL', createdDate: '2026-02-13', assignedTo: 'Quality Team' },
    { id: 'CMP-004', consumerId: 'CON-104', consumerName: 'Green Valley School', category: 'Billing Dispute', description: 'Bill amount ₹3200 is too high for institutional connection.', status: 'RESOLVED', priority: 'LOW', createdDate: '2026-02-10', resolvedDate: '2026-02-14', assignedTo: 'Revenue Dept' },
    { id: 'CMP-005', consumerId: 'CON-105', consumerName: 'Anand Mall', category: 'Meter Faulty', description: 'Meter readings not changing even though water is being used.', status: 'OPEN', priority: 'HIGH', createdDate: '2026-02-15' },
    { id: 'CMP-006', consumerId: 'CON-106', consumerName: 'Mohan Das', category: 'Leakage', description: 'Pipeline leakage near house gate since 3 days.', status: 'CLOSED', priority: 'MEDIUM', createdDate: '2026-02-08', resolvedDate: '2026-02-11', assignedTo: 'Maintenance Team' },
];

const priorityColors: Record<string, { color: string; bg: string }> = {
    LOW: { color: '#10b981', bg: '#ecfdf5' }, MEDIUM: { color: '#f59e0b', bg: '#fffbeb' },
    HIGH: { color: '#ef4444', bg: '#fef2f2' }, CRITICAL: { color: '#dc2626', bg: '#fef2f2' },
};
const statusColors: Record<string, { color: string; bg: string }> = {
    OPEN: { color: '#6366f1', bg: '#eef2ff' }, IN_PROGRESS: { color: '#f59e0b', bg: '#fffbeb' },
    RESOLVED: { color: '#10b981', bg: '#ecfdf5' }, CLOSED: { color: '#6b7280', bg: '#f3f4f6' },
};

export default function ComplaintsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const open = mockComplaints.filter(c => c.status === 'OPEN').length;
    const inProgress = mockComplaints.filter(c => c.status === 'IN_PROGRESS').length;
    const resolved = mockComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

    const filtered = mockComplaints.filter(c => c.consumerName.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm) || c.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Complaints" value={mockComplaints.length} subtitle="All time" icon={MessageSquare} gradient="blue" />
                <StatsCard title="Open" value={open} subtitle="Awaiting assignment" icon={AlertTriangle} gradient="rose" variant="outlined" />
                <StatsCard title="In Progress" value={inProgress} subtitle="Being addressed" icon={Clock} gradient="amber" variant="flat" />
                <StatsCard title="Resolved" value={resolved} subtitle="Closed successfully" icon={CheckCircle2} gradient="green" variant="outlined" />
            </div>

            {/* SLA Progress */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>SLA Compliance</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>78% within SLA</span>
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{ width: '78%', height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)' }} />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input type="text" placeholder="Search complaints..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '260px', outline: 'none' }} />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    <Plus style={{ width: '14px', height: '14px' }} /> Log Complaint
                </button>
            </div>

            {/* Complaints List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map(c => {
                    const pc = priorityColors[c.priority];
                    const sc = statusColors[c.status];
                    return (
                        <div key={c.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5' }}>{c.id}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: pc.bg, color: pc.color }}>{c.priority}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color }}>{c.status.replace('_', ' ')}</span>
                                </div>
                                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{c.category} — {c.consumerName}</h4>
                                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>{c.description}</p>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '11px', color: '#9ca3af' }}>
                                    <span>Filed: {c.createdDate}</span>
                                    {c.assignedTo && <span>Assigned: {c.assignedTo}</span>}
                                    {c.resolvedDate && <span>Resolved: {c.resolvedDate}</span>}
                                </div>
                            </div>
                            <ChevronRight style={{ width: '16px', height: '16px', color: '#d1d5db', marginTop: '4px' }} />
                        </div>
                    );
                })}
            </div>

            {/* New Complaint Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Log New Complaint" subtitle="Register a consumer grievance" icon={MessageSquare}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success('Complaint registered'); }}>
                    <FormSection title="Consumer Details" columns={2}>
                        <FormField label="Consumer ID" required><input className={inputClass} placeholder="CON-XXX" /></FormField>
                        <FormField label="Consumer Name" required><input className={inputClass} placeholder="Full name" /></FormField>
                    </FormSection>
                    <FormSection title="Complaint Details" columns={2}>
                        <FormField label="Category" required><select className={selectClass}><option>No Water Supply</option><option>Low Pressure</option><option>Water Quality</option><option>Leakage</option><option>Meter Faulty</option><option>Billing Dispute</option><option>Other</option></select></FormField>
                        <FormField label="Priority"><select className={selectClass}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></FormField>
                        <div style={{ gridColumn: 'span 2' }}><FormField label="Description" required><textarea className={textareaClass} rows={3} placeholder="Describe the issue in detail..." /></FormField></div>
                    </FormSection>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Submit Complaint</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
