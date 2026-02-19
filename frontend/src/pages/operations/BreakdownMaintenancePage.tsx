import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle2, Search, Plus, Zap } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Breakdown {
    id: string; assetName: string; assetId: string; description: string; reportedBy: string;
    reportedDate: string; resolvedDate?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'REPORTED' | 'ASSIGNED' | 'IN_REPAIR' | 'RESOLVED'; assignedTo?: string;
    downtime?: string; rootCause?: string; partsUsed?: string[];
}

const mockData: Breakdown[] = [
    { id: 'BK-001', assetName: 'Centrifugal Pump #1', assetId: 'AST-001', description: 'Motor overheating. Pump auto-tripped on thermal overload.', reportedBy: 'Operator Gogoi', reportedDate: '2026-02-15', priority: 'CRITICAL', status: 'IN_REPAIR', assignedTo: 'Mr. Kalita', downtime: '6 hrs' },
    { id: 'BK-002', assetName: 'Flow Meter FM-03', assetId: 'AST-003', description: 'Erratic readings — showing zero flow despite operational pipeline.', reportedBy: 'Control Room', reportedDate: '2026-02-14', priority: 'HIGH', status: 'ASSIGNED', assignedTo: 'Quality Team' },
    { id: 'BK-003', assetName: 'Butterfly Valve V-12', assetId: 'AST-004', description: 'Valve stuck in partially open position.', reportedBy: 'Field Team', reportedDate: '2026-02-13', priority: 'MEDIUM', status: 'RESOLVED', assignedTo: 'Mr. Bora', resolvedDate: '2026-02-14', downtime: '4 hrs', rootCause: 'Corroded stem', partsUsed: ['Stem seal kit', 'Gearbox assembly'] },
    { id: 'BK-004', assetName: 'Pressure Sensor PS-08', assetId: 'AST-006', description: 'Complete sensor failure. No output signal.', reportedBy: 'SCADA Alert', reportedDate: '2026-02-12', priority: 'HIGH', status: 'RESOLVED', assignedTo: 'Instrumentation', resolvedDate: '2026-02-13', downtime: '8 hrs', rootCause: 'Water ingress', partsUsed: ['Sensor unit', 'Cable gland'] },
    { id: 'BK-005', assetName: 'Diesel Generator DG-2', assetId: 'AST-005', description: 'Radiator coolant leak from upper hose.', reportedBy: 'Power Section', reportedDate: '2026-02-15', priority: 'MEDIUM', status: 'REPORTED' },
];

const prioColor: Record<string, { color: string; bg: string }> = { LOW: { color: '#10b981', bg: '#ecfdf5' }, MEDIUM: { color: '#f59e0b', bg: '#fffbeb' }, HIGH: { color: '#ef4444', bg: '#fef2f2' }, CRITICAL: { color: '#dc2626', bg: '#fef2f2' } };
const statColor: Record<string, { color: string; bg: string }> = { REPORTED: { color: '#6366f1', bg: '#eef2ff' }, ASSIGNED: { color: '#f59e0b', bg: '#fffbeb' }, IN_REPAIR: { color: '#06b6d4', bg: '#ecfeff' }, RESOLVED: { color: '#10b981', bg: '#ecfdf5' } };

export default function BreakdownMaintenancePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const active = mockData.filter(b => b.status !== 'RESOLVED').length;
    const critical = mockData.filter(b => b.priority === 'CRITICAL' && b.status !== 'RESOLVED').length;
    const resolved = mockData.filter(b => b.status === 'RESOLVED').length;
    const filtered = mockData.filter(b => b.assetName.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Active" value={active} subtitle="Unresolved" icon={AlertTriangle} gradient="rose" />
                <StatsCard title="Critical" value={critical} subtitle="Immediate" icon={Zap} gradient="rose" variant="outlined" />
                <StatsCard title="Resolved" value={resolved} subtitle="This month" icon={CheckCircle2} gradient="green" variant="flat" />
                <StatsCard title="Avg Downtime" value="6 hrs" subtitle="Per breakdown" icon={Clock} gradient="amber" variant="outlined" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input type="text" placeholder="Search breakdowns..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '32px', paddingRight: '12px', padding: '8px 12px 8px 32px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '280px', outline: 'none' }} />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}><Plus style={{ width: '14px', height: '14px' }} /> Report Breakdown</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map(b => {
                    const pc = prioColor[b.priority]; const sc = statColor[b.status];
                    return (
                        <div key={b.id} style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${b.priority === 'CRITICAL' ? '#fecaca' : '#f1f5f9'}`, padding: '16px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5' }}>{b.id}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: pc.bg, color: pc.color }}>{b.priority}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color }}>{b.status.replace('_', ' ')}</span>
                                </div>
                                {b.downtime && <span style={{ fontSize: '11px', fontWeight: 600, color: '#ef4444' }}>⏱ {b.downtime}</span>}
                            </div>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{b.assetName} ({b.assetId})</h4>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 6px 0' }}>{b.description}</p>
                            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#9ca3af' }}>
                                <span>Reported: {b.reportedDate}</span>{b.assignedTo && <span>Assigned: {b.assignedTo}</span>}{b.resolvedDate && <span>Resolved: {b.resolvedDate}</span>}
                            </div>
                            {b.rootCause && <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px' }}><strong style={{ color: '#065f46' }}>Root Cause:</strong> {b.rootCause}{b.partsUsed && <> · <strong style={{ color: '#065f46' }}>Parts:</strong> {b.partsUsed.join(', ')}</>}</div>}
                            {b.status === 'REPORTED' && <button style={{ marginTop: '8px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', background: '#4f46e5', color: '#fff', cursor: 'pointer' }}>Assign Technician</button>}
                            {b.status === 'IN_REPAIR' && <button style={{ marginTop: '8px', padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}>Mark Resolved</button>}
                        </div>
                    );
                })}
            </div>
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Report Breakdown" subtitle="Log equipment failure" icon={AlertTriangle}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success('Breakdown reported'); }}>
                    <FormSection title="Details" columns={2}>
                        <FormField label="Asset" required><select className={selectClass}><option>Centrifugal Pump #1</option><option>Chlorination Unit</option><option>Flow Meter FM-03</option><option>Diesel Generator DG-2</option></select></FormField>
                        <FormField label="Priority" required><select className={selectClass}><option>LOW</option><option>MEDIUM</option><option>HIGH</option><option>CRITICAL</option></select></FormField>
                        <FormField label="Reported By"><input className={inputClass} placeholder="Name" /></FormField>
                        <FormField label="Assign To"><input className={inputClass} placeholder="Technician" /></FormField>
                        <div style={{ gridColumn: 'span 2' }}><FormField label="Description" required><textarea className={textareaClass} rows={3} placeholder="Describe the breakdown..." /></FormField></div>
                    </FormSection>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Report</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
