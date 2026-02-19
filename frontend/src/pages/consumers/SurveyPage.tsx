import { useState } from 'react';
import { ClipboardCheck, MapPin, Calendar, User, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';

interface Survey {
    id: string; applicationId: string; applicantName: string; address: string;
    surveyDate: string; surveyor: string; status: 'SCHEDULED' | 'COMPLETED' | 'FAILED';
    findings?: string; feasible?: boolean;
}

const mockSurveys: Survey[] = [
    { id: 'SRV-001', applicationId: 'APP-2026-002', applicantName: 'Priya Devi Borah', address: '18, Station Road, Ward 5', surveyDate: '2026-02-16', surveyor: 'Mr. Kalita', status: 'SCHEDULED' },
    { id: 'SRV-002', applicationId: 'APP-2026-005', applicantName: 'Anand Shopping Mall', address: 'Commerce Hub, Ward 1', surveyDate: '2026-02-15', surveyor: 'Mr. Hazarika', status: 'COMPLETED', findings: 'Pipeline available within 20m. Feasible for direct connection.', feasible: true },
    { id: 'SRV-003', applicationId: 'APP-2026-003', applicantName: 'Assam Textiles Pvt Ltd', address: 'Industrial Area, Sector 4', surveyDate: '2026-02-14', surveyor: 'Mr. Das', status: 'COMPLETED', findings: 'Requires 50m pipeline extension. Higher cost estimate.', feasible: true },
    { id: 'SRV-004', applicationId: 'APP-2026-004', applicantName: 'Green Valley School', address: '22, College Road, Ward 3', surveyDate: '2026-02-13', surveyor: 'Mr. Bora', status: 'FAILED', findings: 'No nearby pipeline. Area not covered by distribution network.' },
];

const statusColors: Record<string, { color: string; bg: string }> = {
    SCHEDULED: { color: '#f59e0b', bg: '#fffbeb' },
    COMPLETED: { color: '#10b981', bg: '#ecfdf5' },
    FAILED: { color: '#ef4444', bg: '#fef2f2' },
};

export default function SurveyPage() {
    const scheduled = mockSurveys.filter(s => s.status === 'SCHEDULED').length;
    const completed = mockSurveys.filter(s => s.status === 'COMPLETED').length;
    const feasible = mockSurveys.filter(s => s.feasible).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Surveys" value={mockSurveys.length} subtitle="All records" icon={ClipboardCheck} gradient="blue" />
                <StatsCard title="Scheduled" value={scheduled} subtitle="Upcoming surveys" icon={Calendar} gradient="amber" variant="outlined" />
                <StatsCard title="Completed" value={completed} subtitle="Survey done" icon={CheckCircle2} gradient="green" variant="flat" />
                <StatsCard title="Feasible" value={feasible} subtitle="Connection possible" icon={MapPin} gradient="cyan" variant="outlined" />
            </div>

            {/* Survey Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {mockSurveys.map(s => {
                    const sc = statusColors[s.status];
                    return (
                        <div key={s.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600, margin: 0 }}>{s.id} · {s.applicationId}</p>
                                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '4px 0 0 0' }}>{s.applicantName}</h3>
                                </div>
                                <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{s.status}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin style={{ width: '13px', height: '13px', color: '#9ca3af' }} />{s.address}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar style={{ width: '13px', height: '13px', color: '#9ca3af' }} />{s.surveyDate}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <User style={{ width: '13px', height: '13px', color: '#9ca3af' }} />Surveyor: {s.surveyor}
                                </div>
                            </div>
                            {s.findings && (
                                <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '8px', background: s.feasible ? '#ecfdf5' : '#fef2f2', fontSize: '11px', color: s.feasible ? '#065f46' : '#991b1b', lineHeight: 1.4 }}>
                                    <strong>Findings:</strong> {s.findings}
                                </div>
                            )}
                            {s.status === 'SCHEDULED' && (
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                                    <button style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }}>Start Survey</button>
                                    <button style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer' }}>Reschedule</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
