import { useState } from 'react';
import { QrCode, MapPin, Search, Plus, Filter, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass, textareaClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface AssetRecord {
    id: string; name: string; type: string; subType: string; model: string; manufacturer: string;
    serialNo: string; qrCode: string; gpsLat: number; gpsLng: number; facility: string; zone: string;
    installDate: string; warrantyEnd: string; status: 'OPERATIONAL' | 'NEEDS_REPAIR' | 'DECOMMISSIONED';
    specs: Record<string, string>;
}

const mockAssets: AssetRecord[] = [
    { id: 'AST-001', name: 'Centrifugal Pump #1', type: 'Pump', subType: 'Centrifugal', model: 'KSB Mega 80-250', manufacturer: 'KSB', serialNo: 'KSB-2024-45021', qrCode: 'QR-AST-001', gpsLat: 26.1700, gpsLng: 91.7180, facility: 'Pandu WTP (Conventional)', zone: 'Zone A – Pandu', installDate: '2023-06-15', warrantyEnd: '2026-06-15', status: 'OPERATIONAL', specs: { 'Flow Rate': '120 m³/hr', 'Head': '25m', 'Power': '22 kW', 'Voltage': '415V' } },
    { id: 'AST-002', name: 'Chlorination Unit CU-01', type: 'Treatment', subType: 'Chlorinator', model: 'Wallace & Tiernan V-10K', manufacturer: 'Evoqua', serialNo: 'EVQ-2024-8801', qrCode: 'QR-AST-002', gpsLat: 26.1690, gpsLng: 91.7185, facility: 'Pandu WTP (Conventional)', zone: 'Zone A – Pandu', installDate: '2023-08-10', warrantyEnd: '2025-08-10', status: 'OPERATIONAL', specs: { 'Capacity': '10 kg/hr', 'Feed Rate': '0-500 g/hr', 'Type': 'Vacuum' } },
    { id: 'AST-003', name: 'Flow Meter FM-03', type: 'Meter', subType: 'Electromagnetic', model: 'Endress+Hauser Promag W', manufacturer: 'E+H', serialNo: 'EH-2024-FM03', qrCode: 'QR-AST-003', gpsLat: 26.1445, gpsLng: 91.7898, facility: 'Dispur OHT', zone: 'Zone B – Dispur', installDate: '2024-01-20', warrantyEnd: '2027-01-20', status: 'NEEDS_REPAIR', specs: { 'Size': 'DN200', 'Accuracy': '±0.5%', 'Protocol': 'HART/Modbus' } },
    { id: 'AST-004', name: 'Butterfly Valve V-12', type: 'Valve', subType: 'Butterfly', model: 'Kirloskar BV-300', manufacturer: 'Kirloskar', serialNo: 'KBL-2023-V12', qrCode: 'QR-AST-004', gpsLat: 26.1650, gpsLng: 91.7420, facility: 'Chandmari GSR', zone: 'Zone C – Chandmari', installDate: '2022-11-05', warrantyEnd: '2025-11-05', status: 'OPERATIONAL', specs: { 'Size': 'DN300', 'Pressure': 'PN16', 'Material': 'CI Body, SS Disc' } },
    { id: 'AST-005', name: 'Diesel Generator DG-2', type: 'Generator', subType: 'Diesel', model: 'Cummins C500D5', manufacturer: 'Cummins', serialNo: 'CUM-2024-DG02', qrCode: 'QR-AST-005', gpsLat: 26.1695, gpsLng: 91.7175, facility: 'Pandu WTP (Conventional)', zone: 'Zone A – Pandu', installDate: '2024-03-01', warrantyEnd: '2027-03-01', status: 'OPERATIONAL', specs: { 'Capacity': '500 kVA', 'Fuel': 'Diesel', 'Runtime': '8 hrs at full load' } },
    { id: 'AST-006', name: 'Pressure Sensor PS-08', type: 'Sensor', subType: 'Pressure Transducer', model: 'WIKA S-20', manufacturer: 'WIKA', serialNo: 'WK-2024-PS08', qrCode: 'QR-AST-006', gpsLat: 26.5020, gpsLng: 91.0050, facility: 'Barpeta WTP', zone: 'Zone D – Barpeta', installDate: '2024-06-15', warrantyEnd: '2026-06-15', status: 'DECOMMISSIONED', specs: { 'Range': '0-10 bar', 'Output': '4-20mA', 'Accuracy': '±0.25%' } },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    OPERATIONAL: { color: '#10b981', bg: '#ecfdf5', label: 'Operational' },
    NEEDS_REPAIR: { color: '#f59e0b', bg: '#fffbeb', label: 'Needs Repair' },
    DECOMMISSIONED: { color: '#6b7280', bg: '#f3f4f6', label: 'Decommissioned' },
};

export default function AssetInventoryPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedAsset, setExpandedAsset] = useState<string | null>(null);
    const [filterType, setFilterType] = useState('ALL');

    const operational = mockAssets.filter(a => a.status === 'OPERATIONAL').length;
    const types = [...new Set(mockAssets.map(a => a.type))];

    const filtered = mockAssets.filter(a =>
        (filterType === 'ALL' || a.type === filterType) &&
        (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) || a.qrCode.includes(searchTerm))
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Assets" value={mockAssets.length} subtitle="Registered items" icon={QrCode} gradient="blue" />
                <StatsCard title="Operational" value={operational} subtitle="Working condition" icon={QrCode} gradient="green" variant="outlined" />
                <StatsCard title="GIS Tagged" value={mockAssets.filter(a => a.gpsLat).length} subtitle="Geo-located" icon={MapPin} gradient="cyan" variant="flat" />
                <StatsCard title="QR Tagged" value={mockAssets.filter(a => a.qrCode).length} subtitle="Scannable" icon={QrCode} gradient="purple" variant="outlined" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                        <input type="text" placeholder="Search by name, serial, or QR..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '280px', outline: 'none' }} />
                    </div>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', outline: 'none', cursor: 'pointer' }}>
                        <option value="ALL">All Types</option>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                    <Plus style={{ width: '14px', height: '14px' }} /> Register Asset
                </button>
            </div>

            {/* Asset Table with Expandable Specs */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['', 'Asset ID', 'Name', 'Type', 'Manufacturer / Model', 'QR Code', 'Facility / Zone', 'Status'].map(h => (
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => {
                            const sc = statusConfig[a.status];
                            const isExpanded = expandedAsset === a.id;
                            return (
                                <>
                                    <tr key={a.id} onClick={() => setExpandedAsset(isExpanded ? null : a.id)}
                                        style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td style={{ padding: '10px 12px', width: '30px' }}>
                                            {isExpanded ? <ChevronDown style={{ width: '14px', height: '14px', color: '#6366f1' }} /> : <ChevronRight style={{ width: '14px', height: '14px', color: '#9ca3af' }} />}
                                        </td>
                                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#4f46e5' }}>{a.id}</td>
                                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#111827' }}>{a.name}</td>
                                        <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>{a.type} — {a.subType}</span></td>
                                        <td style={{ padding: '10px 12px', color: '#374151' }}><div style={{ fontWeight: 500 }}>{a.manufacturer}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{a.model}</div></td>
                                        <td style={{ padding: '10px 12px' }}><span style={{ fontFamily: 'monospace', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#f5f3ff', color: '#7c3aed' }}>{a.qrCode}</span></td>
                                        <td style={{ padding: '10px 12px', color: '#374151' }}><div style={{ fontWeight: 500 }}>{a.facility}</div><div style={{ fontSize: '11px', color: '#9ca3af' }}>{a.zone}</div></td>
                                        <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: sc.bg, color: sc.color }}>{sc.label}</span></td>
                                    </tr>
                                    {isExpanded && (
                                        <tr key={`${a.id}-specs`}>
                                            <td colSpan={8} style={{ padding: '0 12px 14px 44px', background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '12px' }}>
                                                    {/* Specs */}
                                                    <div>
                                                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Specifications</p>
                                                        {Object.entries(a.specs).map(([k, v]) => (
                                                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                                                <span style={{ color: '#9ca3af' }}>{k}</span>
                                                                <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Details */}
                                                    <div>
                                                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Asset Details</p>
                                                        <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div><span style={{ color: '#9ca3af' }}>Serial: </span><span style={{ fontWeight: 600, fontFamily: 'monospace', color: '#111827' }}>{a.serialNo}</span></div>
                                                            <div><span style={{ color: '#9ca3af' }}>Installed: </span><span style={{ fontWeight: 600, color: '#111827' }}>{a.installDate}</span></div>
                                                            <div><span style={{ color: '#9ca3af' }}>Warranty: </span><span style={{ fontWeight: 600, color: new Date(a.warrantyEnd) < new Date() ? '#ef4444' : '#10b981' }}>{a.warrantyEnd}</span></div>
                                                        </div>
                                                    </div>
                                                    {/* Location */}
                                                    <div>
                                                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>GIS Location</p>
                                                        <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <div><span style={{ color: '#9ca3af' }}>Latitude: </span><span style={{ fontWeight: 600, fontFamily: 'monospace', color: '#111827' }}>{a.gpsLat.toFixed(4)}</span></div>
                                                            <div><span style={{ color: '#9ca3af' }}>Longitude: </span><span style={{ fontWeight: 600, fontFamily: 'monospace', color: '#111827' }}>{a.gpsLng.toFixed(4)}</span></div>
                                                        </div>
                                                        <button style={{ marginTop: '8px', padding: '4px 10px', fontSize: '10px', fontWeight: 600, borderRadius: '6px', border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', cursor: 'pointer' }}>
                                                            <MapPin style={{ width: '10px', height: '10px', display: 'inline', marginRight: '4px' }} />View on Map
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Register Asset Form */}
            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register New Asset" subtitle="Add equipment to inventory with QR/GIS tags" icon={QrCode}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success('Asset registered successfully'); }}>
                    <FormSection title="Basic Information" columns={2}>
                        <FormField label="Asset Name" required><input className={inputClass} placeholder="e.g. Centrifugal Pump #5" /></FormField>
                        <FormField label="Type" required><select className={selectClass}><option>Pump</option><option>Valve</option><option>Meter</option><option>Sensor</option><option>Generator</option><option>Treatment</option><option>Other</option></select></FormField>
                        <FormField label="Sub-Type"><input className={inputClass} placeholder="e.g. Centrifugal, Butterfly" /></FormField>
                        <FormField label="Manufacturer"><input className={inputClass} placeholder="e.g. KSB, Kirloskar" /></FormField>
                        <FormField label="Model"><input className={inputClass} placeholder="Model number" /></FormField>
                        <FormField label="Serial Number"><input className={inputClass} placeholder="Serial / barcode" /></FormField>
                    </FormSection>
                    <FormSection title="Location & Tagging" columns={2}>
                        <FormField label="Facility"><select className={selectClass}><option>Pandu WTP (Conventional)</option><option>Deepor Beel WTP</option><option>Barpeta WTP</option><option>Dispur Borewell Package Plant</option><option>Jorhat WTP</option><option>Dispur OHT</option><option>Chandmari GSR</option></select></FormField>
                        <FormField label="Zone"><select className={selectClass}><option>Zone A – Pandu</option><option>Zone B – Dispur</option><option>Zone C – Chandmari</option><option>Zone D – Barpeta</option><option>Zone E – Jorhat</option><option>Zone F – Deepor Beel</option></select></FormField>
                        <FormField label="GPS Latitude"><input className={inputClass} placeholder="26.1445" /></FormField>
                        <FormField label="GPS Longitude"><input className={inputClass} placeholder="91.7362" /></FormField>
                        <FormField label="QR Code" hint="Auto-generated or manual entry"><input className={inputClass} placeholder="QR-AST-XXX" /></FormField>
                        <FormField label="Install Date"><input type="date" className={inputClass} /></FormField>
                    </FormSection>
                    <FormSection title="Specifications">
                        <FormField label="Technical Notes"><textarea className={textareaClass} rows={3} placeholder="Enter key specifications..." /></FormField>
                    </FormSection>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Register Asset</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
