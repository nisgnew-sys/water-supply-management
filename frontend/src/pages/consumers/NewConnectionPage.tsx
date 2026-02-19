import { useState } from 'react';
import { Plus, Search, FileText, CheckCircle2, Clock, XCircle, Eye, ChevronRight } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface Application {
    id: string; applicantName: string; phone: string; address: string; category: string;
    status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'; submittedDate: string; wardNo: string;
}

const mockApplications: Application[] = [
    { id: 'APP-2026-001', applicantName: 'Rajesh Kumar Sharma', phone: '9876543210', address: '45, MG Road, Ward 12, Guwahati', category: 'RESIDENTIAL', status: 'SUBMITTED', submittedDate: '2026-02-14', wardNo: '12' },
    { id: 'APP-2026-002', applicantName: 'Priya Devi Borah', phone: '9876543211', address: '18, Station Road, Ward 5, Guwahati', category: 'RESIDENTIAL', status: 'UNDER_REVIEW', submittedDate: '2026-02-12', wardNo: '5' },
    { id: 'APP-2026-003', applicantName: 'Assam Textiles Pvt Ltd', phone: '9876543212', address: 'Industrial Area, Sector 4, Nagaon', category: 'INDUSTRIAL', status: 'APPROVED', submittedDate: '2026-02-10', wardNo: '8' },
    { id: 'APP-2026-004', applicantName: 'Green Valley School', phone: '9876543213', address: '22, College Road, Ward 3, Jorhat', category: 'INSTITUTIONAL', status: 'REJECTED', submittedDate: '2026-02-08', wardNo: '3' },
    { id: 'APP-2026-005', applicantName: 'Anand Shopping Mall', phone: '9876543214', address: 'Commerce Hub, Ward 1, Dibrugarh', category: 'COMMERCIAL', status: 'UNDER_REVIEW', submittedDate: '2026-02-13', wardNo: '1' },
    { id: 'APP-2026-006', applicantName: 'Mohan Das', phone: '9876543215', address: '67, Lake Road, Ward 9, Tinsukia', category: 'RESIDENTIAL', status: 'SUBMITTED', submittedDate: '2026-02-15', wardNo: '9' },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    SUBMITTED: { color: '#6366f1', bg: '#eef2ff', icon: FileText },
    UNDER_REVIEW: { color: '#f59e0b', bg: '#fffbeb', icon: Clock },
    APPROVED: { color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2 },
    REJECTED: { color: '#ef4444', bg: '#fef2f2', icon: XCircle },
};

export default function NewConnectionPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const submitted = mockApplications.filter(a => a.status === 'SUBMITTED').length;
    const underReview = mockApplications.filter(a => a.status === 'UNDER_REVIEW').length;
    const approved = mockApplications.filter(a => a.status === 'APPROVED').length;

    const filtered = mockApplications.filter(a =>
        (filterStatus === 'ALL' || a.status === filterStatus) &&
        (a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.includes(searchTerm))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Applications" value={mockApplications.length} subtitle="All time" icon={FileText} gradient="blue" />
                <StatsCard title="New / Submitted" value={submitted} subtitle="Awaiting review" icon={Clock} gradient="amber" variant="outlined" />
                <StatsCard title="Under Review" value={underReview} subtitle="Being processed" icon={Eye} gradient="cyan" variant="flat" />
                <StatsCard title="Approved" value={approved} subtitle="Ready for survey" icon={CheckCircle2} gradient="green" variant="outlined" />
            </div>

            {/* Pipeline Progress */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '12px' }}>Application Pipeline</p>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {['Submission', 'Document Verification', 'Site Survey', 'Approval', 'Activation'].map((step, i) => (
                        <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: i < 2 ? '#eef2ff' : '#f9fafb', color: i < 2 ? '#4f46e5' : '#9ca3af', border: `1px solid ${i < 2 ? '#c7d2fe' : '#e5e7eb'}` }}>
                                {step}
                            </div>
                            {i < 4 && <ChevronRight style={{ width: '14px', height: '14px', color: '#d1d5db', flexShrink: 0 }} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                        <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '260px', outline: 'none' }} />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}>
                        <option value="ALL">All Status</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    <Plus style={{ width: '14px', height: '14px' }} /> New Application
                </button>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['Application ID', 'Applicant', 'Phone', 'Category', 'Ward', 'Date', 'Status', 'Action'].map(h => (
                                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(app => {
                            const sc = statusConfig[app.status];
                            const StatusIcon = sc.icon;
                            return (
                                <tr key={app.id} style={{ borderBottom: '1px solid #f3f4f6' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#4f46e5' }}>{app.id}</td>
                                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#111827' }}>{app.applicantName}</td>
                                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{app.phone}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>{app.category}</span>
                                    </td>
                                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{app.wardNo}</td>
                                    <td style={{ padding: '10px 14px', color: '#6b7280' }}>{app.submittedDate}</td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: sc.bg, color: sc.color }}>
                                            <StatusIcon style={{ width: '12px', height: '12px' }} />
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px 14px' }}>
                                        <button style={{ padding: '4px 10px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', color: '#374151' }}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* New Application Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Connection Application" subtitle="Submit a new water connection request" icon={FileText}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success('Application submitted successfully'); }}>
                    <FormSection title="Applicant Details" columns={2}>
                        <FormField label="Full Name" required><input className={inputClass} placeholder="Full name of applicant" /></FormField>
                        <FormField label="Phone Number" required><input className={inputClass} placeholder="+91 XXXXX XXXXX" /></FormField>
                        <FormField label="Email"><input type="email" className={inputClass} placeholder="email@example.com" /></FormField>
                        <FormField label="Aadhaar Number"><input className={inputClass} placeholder="XXXX XXXX XXXX" /></FormField>
                        <div style={{ gridColumn: 'span 2' }}><FormField label="Address" required><textarea className={textareaClass} rows={2} placeholder="Full address with ward number" /></FormField></div>
                    </FormSection>
                    <FormSection title="Connection Details" columns={2}>
                        <FormField label="Category" required><select className={selectClass}><option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option><option value="INDUSTRIAL">Industrial</option><option value="INSTITUTIONAL">Institutional</option></select></FormField>
                        <FormField label="Connection Size"><select className={selectClass}><option value="0.5">½ inch</option><option value="0.75">¾ inch</option><option value="1">1 inch</option><option value="1.5">1½ inch</option></select></FormField>
                        <FormField label="Ward Number"><input className={inputClass} placeholder="e.g. 12" /></FormField>
                        <FormField label="District"><select className={selectClass}><option>Kamrup Metropolitan</option><option>Nagaon</option><option>Sonitpur</option><option>Dibrugarh</option><option>Jorhat</option></select></FormField>
                    </FormSection>
                    <FormSection title="Documents">
                        <FormField label="Upload Documents" hint="Aadhaar, property proof, NOC (PDF/JPG, max 5MB each)">
                            <input type="file" multiple className={inputClass} />
                        </FormField>
                    </FormSection>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Submit Application</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
