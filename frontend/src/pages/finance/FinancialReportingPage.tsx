import { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter, Landmark, BookOpen, FileBarChart, FileCheck2 } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';

type ReportCategory = 'ALL' | 'STATUTORY' | 'GRANTS' | 'INTERNAL' | 'AUDIT';

interface Report {
    id: string; name: string; category: ReportCategory | string; period: string; generatedOn: string;
    status: 'PUBLISHED' | 'DRAFT' | 'UNDER_REVIEW'; format: string; description: string;
}

const MOCK_REPORTS: Report[] = [
    { id: 'RPT-001', name: 'Annual Financial Statement FY 2024-25', category: 'STATUTORY', period: 'FY 2024-25', generatedOn: '2025-06-30', status: 'PUBLISHED', format: 'PDF', description: 'Comprehensive audited financial statement as per Government of Assam guidelines.' },
    { id: 'RPT-002', name: 'JJM Utilization Certificate – Q3', category: 'GRANTS', period: 'Oct-Dec 2025', generatedOn: '2026-01-15', status: 'PUBLISHED', format: 'PDF', description: 'Fund utilization certificate for Jal Jeevan Mission grant disbursements.' },
    { id: 'RPT-003', name: 'Monthly Revenue Report – Jan 2026', category: 'INTERNAL', period: 'Jan 2026', generatedOn: '2026-02-05', status: 'PUBLISHED', format: 'XLSX', description: 'Zone-wise revenue collection vs target with variance analysis.' },
    { id: 'RPT-004', name: 'Quarterly Budget vs Actual – Q4', category: 'INTERNAL', period: 'Jan-Mar 2026', generatedOn: '2026-02-10', status: 'DRAFT', format: 'PDF', description: 'Department-wise budget allocation vs actual expenditure comparison.' },
    { id: 'RPT-005', name: 'CAG Audit Compliance Report', category: 'AUDIT', period: 'FY 2024-25', generatedOn: '2025-12-20', status: 'PUBLISHED', format: 'PDF', description: 'Compliance with CAG audit observations and action taken report.' },
    { id: 'RPT-006', name: 'AMRUT-2.0 Fund Utilization', category: 'GRANTS', period: 'FY 2025-26', generatedOn: '2026-01-25', status: 'UNDER_REVIEW', format: 'PDF', description: 'Progress and fund utilization report for AMRUT 2.0 water supply projects.' },
    { id: 'RPT-007', name: 'NRW Financial Impact Assessment', category: 'INTERNAL', period: 'H2 FY 2025-26', generatedOn: '2026-02-12', status: 'DRAFT', format: 'XLSX', description: 'Revenue loss estimation due to non-revenue water and proposed interventions.' },
    { id: 'RPT-008', name: 'State Finance Commission Submission', category: 'STATUTORY', period: 'FY 2025-26', generatedOn: '2026-02-01', status: 'PUBLISHED', format: 'PDF', description: 'Annual submission to Assam State Finance Commission with financial projections.' },
    { id: 'RPT-009', name: 'Internal Audit – Operations Division', category: 'AUDIT', period: 'Q3 FY 2025-26', generatedOn: '2026-01-30', status: 'PUBLISHED', format: 'PDF', description: 'Internal audit findings for Operations Division covering O&M expenditure.' },
    { id: 'RPT-010', name: 'NABARD Refinance Report', category: 'GRANTS', period: 'FY 2025-26', generatedOn: '2026-02-08', status: 'UNDER_REVIEW', format: 'PDF', description: 'Refinance utilization report for NABARD-funded pipeline infrastructure projects.' },
];

const CATEGORY_ICONS: Record<string, any> = { STATUTORY: Landmark, GRANTS: BookOpen, INTERNAL: FileBarChart, AUDIT: FileCheck2 };
const STATUS_BADGE: Record<string, string> = { PUBLISHED: 'badge-success', DRAFT: 'badge-warning', UNDER_REVIEW: 'badge-info' };
const CATEGORY_LABELS: Record<string, string> = { STATUTORY: 'Statutory', GRANTS: 'Grants & Schemes', INTERNAL: 'Internal', AUDIT: 'Audit' };

export default function FinancialReportingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState<ReportCategory>('ALL');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const published = MOCK_REPORTS.filter(r => r.status === 'PUBLISHED').length;
    const drafts = MOCK_REPORTS.filter(r => r.status === 'DRAFT').length;
    const underReview = MOCK_REPORTS.filter(r => r.status === 'UNDER_REVIEW').length;
    const grantReports = MOCK_REPORTS.filter(r => r.category === 'GRANTS').length;

    const filtered = MOCK_REPORTS.filter(r =>
        (filterCat === 'ALL' || r.category === filterCat) &&
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const categories: ReportCategory[] = ['ALL', 'STATUTORY', 'GRANTS', 'INTERNAL', 'AUDIT'];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard title="Total Reports" value={MOCK_REPORTS.length} subtitle={`${published} published`} icon={FileText} gradient="blue" />
                <StatsCard title="Published" value={published} subtitle="Finalized & submitted" icon={FileCheck2} gradient="green" />
                <StatsCard title="Under Review" value={underReview} subtitle={`${drafts} drafts`} icon={FileBarChart} gradient="amber" />
                <StatsCard title="Grant Reports" value={grantReports} subtitle="JJM, AMRUT, NABARD" icon={Landmark} gradient="purple" />
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                    {categories.map(c => (
                        <button key={c} onClick={() => setFilterCat(c)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterCat === c ? 'gradient-blue text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
                            {c === 'ALL' ? 'All' : CATEGORY_LABELS[c]}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search reports..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white w-full" />
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(report => {
                    const CatIcon = CATEGORY_ICONS[report.category] || FileText;
                    return (
                        <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => setSelectedReport(report)}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-50">
                                        <CatIcon className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">{report.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">{report.id}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{report.period}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${STATUS_BADGE[report.status]}`}>{report.status.replace('_', ' ')}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{report.description}</p>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                <span className="text-xs text-gray-400">Generated: {new Date(report.generatedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-info text-[10px]">{report.format}</span>
                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Eye className="w-3.5 h-3.5" /></button>
                                    <button className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"><Download className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400 text-sm">No reports found</div>}
            </div>

            {/* Report Detail Modal (simple overlay) */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{selectedReport.name}</h3>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Report ID</span><span className="font-medium">{selectedReport.id}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium">{CATEGORY_LABELS[selectedReport.category] || selectedReport.category}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium">{selectedReport.period}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Generated</span><span className="font-medium">{new Date(selectedReport.generatedOn).toLocaleDateString('en-IN')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`badge ${STATUS_BADGE[selectedReport.status]}`}>{selectedReport.status.replace('_', ' ')}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Format</span><span className="badge badge-info">{selectedReport.format}</span></div>
                            <div className="pt-2 border-t border-gray-100">
                                <span className="text-gray-500 block mb-1">Description</span>
                                <p className="text-gray-700">{selectedReport.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> Preview</button>
                            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold gradient-blue text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
