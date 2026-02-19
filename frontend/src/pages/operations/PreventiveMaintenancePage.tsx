import { useState } from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle, Plus, Search } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PMTask {
    id: string; assetName: string; assetId: string; taskType: string; frequency: string;
    lastDone: string; nextDue: string; assignedTo: string; status: 'SCHEDULED' | 'OVERDUE' | 'COMPLETED' | 'IN_PROGRESS';
    checklist: string[];
}

const mockPM: PMTask[] = [
    { id: 'PM-001', assetName: 'Centrifugal Pump #1', assetId: 'AST-001', taskType: 'Bearing Lubrication', frequency: 'Monthly', lastDone: '2026-01-15', nextDue: '2026-02-15', assignedTo: 'Mr. Kalita', status: 'OVERDUE', checklist: ['Check bearing temperature', 'Apply lubricant', 'Check alignment', 'Record vibration'] },
    { id: 'PM-002', assetName: 'Chlorination Unit', assetId: 'AST-002', taskType: 'Chlorine Tank Inspection', frequency: 'Weekly', lastDone: '2026-02-10', nextDue: '2026-02-17', assignedTo: 'Mr. Das', status: 'SCHEDULED', checklist: ['Check chlorine level', 'Inspect feed lines', 'Calibrate dosing', 'Check vacuum system'] },
    { id: 'PM-003', assetName: 'Flow Meter FM-03', assetId: 'AST-003', taskType: 'Calibration', frequency: 'Quarterly', lastDone: '2025-11-20', nextDue: '2026-02-20', assignedTo: 'Quality Team', status: 'SCHEDULED', checklist: ['Zero point check', 'Span verification', 'Electrode cleaning', 'Signal test'] },
    { id: 'PM-004', assetName: 'Diesel Generator DG-2', assetId: 'AST-005', taskType: 'Oil & Filter Change', frequency: 'Every 250 hrs', lastDone: '2026-01-28', nextDue: '2026-02-28', assignedTo: 'Mr. Hazarika', status: 'SCHEDULED', checklist: ['Replace oil', 'Replace oil filter', 'Replace fuel filter', 'Check coolant', 'Battery check'] },
    { id: 'PM-005', assetName: 'Butterfly Valve V-12', assetId: 'AST-004', taskType: 'Seal & Torque Check', frequency: 'Bi-Annual', lastDone: '2025-08-10', nextDue: '2026-02-10', assignedTo: 'Mr. Bora', status: 'OVERDUE', checklist: ['Check seals for wear', 'Measure torque', 'Grease stem', 'Test open/close'] },
    { id: 'PM-006', assetName: 'Centrifugal Pump #1', assetId: 'AST-001', taskType: 'Impeller Inspection', frequency: 'Quarterly', lastDone: '2025-12-15', nextDue: '2026-03-15', assignedTo: 'Mr. Kalita', status: 'COMPLETED', checklist: ['Remove casing', 'Inspect impeller', 'Check wear rings', 'Reassemble'] },
];

const scheduleChart = [
    { month: 'Jan', tasks: 12, completed: 10 }, { month: 'Feb', tasks: 15, completed: 8 },
    { month: 'Mar', tasks: 10, completed: 0 }, { month: 'Apr', tasks: 14, completed: 0 },
];

const statusConfig: Record<string, { color: string; bg: string }> = {
    SCHEDULED: { color: '#6366f1', bg: '#eef2ff' }, OVERDUE: { color: '#ef4444', bg: '#fef2f2' },
    COMPLETED: { color: '#10b981', bg: '#ecfdf5' }, IN_PROGRESS: { color: '#f59e0b', bg: '#fffbeb' },
};

export default function PreventiveMaintenancePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedTask, setExpandedTask] = useState<string | null>(null);

    const overdue = mockPM.filter(t => t.status === 'OVERDUE').length;
    const completed = mockPM.filter(t => t.status === 'COMPLETED').length;
    const scheduled = mockPM.filter(t => t.status === 'SCHEDULED').length;

    const filtered = mockPM.filter(t => t.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || t.taskType.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total PM Tasks" value={mockPM.length} subtitle="Active schedules" icon={Calendar} gradient="blue" />
                <StatsCard title="Scheduled" value={scheduled} subtitle="Upcoming" icon={Clock} gradient="cyan" variant="outlined" />
                <StatsCard title="Overdue" value={overdue} subtitle="Requires attention" icon={AlertTriangle} gradient="rose" variant="flat" />
                <StatsCard title="Completed" value={completed} subtitle="This month" icon={CheckCircle2} gradient="green" variant="outlined" />
            </div>

            {/* Schedule Chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 18px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>PM Schedule & Compliance</h3>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 12px 0' }}>Tasks vs completed per month</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={scheduleChart} barGap={2} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '11px' }} />
                            <Bar dataKey="tasks" fill="#c7d2fe" radius={[4, 4, 0, 0]} name="Scheduled" />
                            <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Compliance Summary */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 12px 0' }}>PM Compliance Rate</h3>
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                        <span style={{ fontSize: '42px', fontWeight: 800, color: '#4f46e5' }}>73%</span>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>Tasks completed on time</p>
                    </div>
                    <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ width: '73%', height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input type="text" placeholder="Search PM tasks..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '280px', outline: 'none' }} />
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    <Plus style={{ width: '14px', height: '14px' }} /> Schedule PM
                </button>
            </div>

            {/* Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map(t => {
                    const sc = statusConfig[t.status];
                    const isExpanded = expandedTask === t.id;
                    return (
                        <div key={t.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}
                            onClick={() => setExpandedTask(isExpanded ? null : t.id)}>
                            <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5' }}>{t.id}</span>
                                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: sc.bg, color: sc.color }}>{t.status.replace('_', ' ')}</span>
                                        <span style={{ fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#64748b' }}>{t.frequency}</span>
                                    </div>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{t.taskType}</h4>
                                    <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{t.assetName} ({t.assetId})</p>
                                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '11px', color: '#9ca3af' }}>
                                        <span>Last: {t.lastDone}</span><span>Due: <strong style={{ color: t.status === 'OVERDUE' ? '#ef4444' : '#374151' }}>{t.nextDue}</strong></span><span>Assigned: {t.assignedTo}</span>
                                    </div>
                                </div>
                            </div>
                            {isExpanded && (
                                <div style={{ padding: '0 18px 14px 18px', borderTop: '1px solid #f1f5f9' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: '12px 0 8px 0' }}>Maintenance Checklist</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                                        {t.checklist.map((item, i) => (
                                            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151', padding: '6px 10px', borderRadius: '6px', background: '#f9fafb', cursor: 'pointer' }}>
                                                <input type="checkbox" defaultChecked={t.status === 'COMPLETED'} style={{ accentColor: '#4f46e5' }} />{item}
                                            </label>
                                        ))}
                                    </div>
                                    {t.status !== 'COMPLETED' && (
                                        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                                            <button style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer' }}>Mark Complete</button>
                                            <button style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer' }}>Reschedule</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Schedule PM Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Schedule Preventive Maintenance" subtitle="Create a new PM task" icon={Calendar}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success('PM task scheduled'); }}>
                    <FormSection title="Task Details" columns={2}>
                        <FormField label="Asset" required><select className={selectClass}><option>Centrifugal Pump #1</option><option>Chlorination Unit</option><option>Flow Meter FM-03</option><option>Diesel Generator DG-2</option></select></FormField>
                        <FormField label="Task Type" required><input className={inputClass} placeholder="e.g. Bearing Lubrication" /></FormField>
                        <FormField label="Frequency"><select className={selectClass}><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Bi-Annual</option><option>Annual</option></select></FormField>
                        <FormField label="Assigned To"><input className={inputClass} placeholder="Technician name" /></FormField>
                        <FormField label="Next Due Date" required><input type="date" className={inputClass} /></FormField>
                    </FormSection>
                    <FormSection title="Checklist">
                        <FormField label="Checklist Items" hint="One item per line"><textarea className={textareaClass} rows={4} placeholder="Check bearing temperature&#10;Apply lubricant&#10;Record vibration level" /></FormField>
                    </FormSection>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Schedule Task</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
