import { useState } from 'react';
import { Package, Truck, Search, Plus, AlertTriangle } from 'lucide-react';
import StatsCard from '../../components/ui/StatsCard';
import SlideOverPanel from '../../components/ui/SlideOverPanel';
import FormSection from '../../components/ui/FormSection';
import FormField, { inputClass, selectClass } from '../../components/ui/FormField';
import toast, { Toaster } from 'react-hot-toast';

interface SparePart {
    id: string; name: string; category: string; partNo: string; qty: number; minQty: number;
    unit: string; vendor: string; lastPurchase: string; unitCost: number; location: string;
}

interface Vendor {
    id: string; name: string; category: string; contact: string; email: string;
    rating: number; activeContracts: number; lastOrder: string; city: string;
}

const mockParts: SparePart[] = [
    { id: 'SP-001', name: 'Bearing 6310-2RS', category: 'Pump', partNo: 'SKF-6310-2RS', qty: 12, minQty: 5, unit: 'Nos', vendor: 'SKF India', lastPurchase: '2026-01-10', unitCost: 1850, location: 'Store A' },
    { id: 'SP-002', name: 'Stem Seal Kit (DN300)', category: 'Valve', partNo: 'KBL-SSK-300', qty: 3, minQty: 4, unit: 'Set', vendor: 'Kirloskar', lastPurchase: '2025-11-15', unitCost: 4200, location: 'Store A' },
    { id: 'SP-003', name: 'Chlorine Gas Cylinder 50kg', category: 'Chemical', partNo: 'CL2-50KG', qty: 8, minQty: 3, unit: 'Nos', vendor: 'Alkali Chemicals', lastPurchase: '2026-02-05', unitCost: 3500, location: 'Chemical Store' },
    { id: 'SP-004', name: 'Oil Filter (Cummins)', category: 'Generator', partNo: 'CUM-LF9009', qty: 2, minQty: 3, unit: 'Nos', vendor: 'Cummins Spares', lastPurchase: '2026-01-28', unitCost: 2100, location: 'Store B' },
    { id: 'SP-005', name: 'Pressure Transmitter WIKA S-20', category: 'Instrument', partNo: 'WK-S20-10BAR', qty: 1, minQty: 2, unit: 'Nos', vendor: 'WIKA India', lastPurchase: '2025-12-20', unitCost: 18500, location: 'Instrument Store' },
    { id: 'SP-006', name: 'HDPE Pipe DN110 (6m)', category: 'Pipeline', partNo: 'HDPE-110-PN10', qty: 45, minQty: 20, unit: 'Pcs', vendor: 'Jain Irrigation', lastPurchase: '2026-02-01', unitCost: 780, location: 'Yard' },
];

const mockVendors: Vendor[] = [
    { id: 'V-001', name: 'SKF India Pvt Ltd', category: 'Bearings & Seals', contact: '+91-9876543210', email: 'orders@skf.in', rating: 4.5, activeContracts: 2, lastOrder: '2026-01-10', city: 'Bangalore' },
    { id: 'V-002', name: 'Kirloskar Brothers Ltd', category: 'Pumps & Valves', contact: '+91-9887654321', email: 'sales@kirloskar.com', rating: 4.2, activeContracts: 3, lastOrder: '2025-11-15', city: 'Pune' },
    { id: 'V-003', name: 'Cummins India', category: 'Generators', contact: '+91-9998765432', email: 'parts@cummins.in', rating: 4.8, activeContracts: 1, lastOrder: '2026-01-28', city: 'Pune' },
    { id: 'V-004', name: 'WIKA Instruments', category: 'Instrumentation', contact: '+91-8876543210', email: 'sales@wika.in', rating: 4.0, activeContracts: 1, lastOrder: '2025-12-20', city: 'Mumbai' },
    { id: 'V-005', name: 'Jain Irrigation Systems', category: 'Pipes & Fittings', contact: '+91-7765432109', email: 'supply@jains.com', rating: 4.3, activeContracts: 2, lastOrder: '2026-02-01', city: 'Jalgaon' },
];

export default function SparePartsVendorPage() {
    const [tab, setTab] = useState<'PARTS' | 'VENDORS'>('PARTS');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const lowStock = mockParts.filter(p => p.qty <= p.minQty).length;
    const totalValue = mockParts.reduce((s, p) => s + p.qty * p.unitCost, 0);

    const filteredParts = mockParts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.partNo.toLowerCase().includes(search.toLowerCase()));
    const filteredVendors = mockVendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Toaster position="top-right" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <StatsCard title="Total Parts" value={mockParts.length} subtitle="In inventory" icon={Package} gradient="blue" />
                <StatsCard title="Low Stock" value={lowStock} subtitle="Below minimum" icon={AlertTriangle} gradient="rose" variant="outlined" />
                <StatsCard title="Vendors" value={mockVendors.length} subtitle="Active suppliers" icon={Truck} gradient="green" variant="flat" />
                <StatsCard title="Inventory Value" value={`₹${(totalValue / 1000).toFixed(0)}K`} subtitle="Total stock value" icon={Package} gradient="purple" variant="outlined" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                        {(['PARTS', 'VENDORS'] as const).map(t => (
                            <button key={t} onClick={() => { setTab(t); setSearch(''); }} style={{ padding: '7px 18px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', background: tab === t ? '#4f46e5' : '#fff', color: tab === t ? '#fff' : '#6b7280' }}>{t === 'PARTS' ? '📦 Spare Parts' : '🚚 Vendors'}</button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#9ca3af' }} />
                        <input type="text" placeholder={`Search ${tab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '32px', paddingRight: '12px', padding: '8px 12px 8px 32px', fontSize: '13px', border: '1px solid #e5e7eb', borderRadius: '8px', width: '240px', outline: 'none' }} />
                    </div>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="gradient-blue text-white" style={{ padding: '8px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}><Plus style={{ width: '14px', height: '14px' }} /> {tab === 'PARTS' ? 'Add Part' : 'Add Vendor'}</button>
            </div>

            {tab === 'PARTS' ? (
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead><tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                            {['Part ID', 'Name', 'Category', 'Part No', 'Qty', 'Min', 'Stock', 'Vendor', 'Unit Cost', 'Location'].map(h => (
                                <th key={h} style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {filteredParts.map(p => {
                                const low = p.qty <= p.minQty;
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }} onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                        <td style={{ padding: '10px', fontWeight: 600, color: '#4f46e5' }}>{p.id}</td>
                                        <td style={{ padding: '10px', fontWeight: 600, color: '#111827' }}>{p.name}</td>
                                        <td style={{ padding: '10px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', background: '#f1f5f9', color: '#475569' }}>{p.category}</span></td>
                                        <td style={{ padding: '10px', fontFamily: 'monospace', fontSize: '11px', color: '#6b7280' }}>{p.partNo}</td>
                                        <td style={{ padding: '10px', fontWeight: 700, color: low ? '#ef4444' : '#111827' }}>{p.qty} {p.unit}</td>
                                        <td style={{ padding: '10px', color: '#9ca3af' }}>{p.minQty}</td>
                                        <td style={{ padding: '10px' }}><span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: low ? '#fef2f2' : '#ecfdf5', color: low ? '#ef4444' : '#10b981' }}>{low ? '⚠ LOW' : '✓ OK'}</span></td>
                                        <td style={{ padding: '10px', fontSize: '11px', color: '#374151' }}>{p.vendor}</td>
                                        <td style={{ padding: '10px', fontWeight: 600, color: '#111827' }}>₹{p.unitCost.toLocaleString()}</td>
                                        <td style={{ padding: '10px', fontSize: '11px', color: '#6b7280' }}>{p.location}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredVendors.map(v => (
                        <div key={v.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)')} onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5' }}>{v.id}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', color: '#475569' }}>{v.category}</span>
                                </div>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>{v.name}</h4>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#9ca3af' }}>
                                    <span>📞 {v.contact}</span><span>📧 {v.email}</span><span>📍 {v.city}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>{'★'.repeat(Math.round(v.rating))} <span style={{ fontSize: '12px', color: '#6b7280' }}>{v.rating}</span></div>
                                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>{v.activeContracts} active contract{v.activeContracts > 1 ? 's' : ''}</p>
                                <p style={{ fontSize: '10px', color: '#9ca3af', margin: '2px 0 0 0' }}>Last order: {v.lastOrder}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SlideOverPanel isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={tab === 'PARTS' ? 'Add Spare Part' : 'Add Vendor'} subtitle={tab === 'PARTS' ? 'Register inventory item' : 'Register supplier'} icon={tab === 'PARTS' ? Package : Truck}>
                <form onSubmit={e => { e.preventDefault(); setIsFormOpen(false); toast.success(tab === 'PARTS' ? 'Part added' : 'Vendor added'); }}>
                    {tab === 'PARTS' ? (
                        <FormSection title="Part Details" columns={2}>
                            <FormField label="Name" required><input className={inputClass} placeholder="Part name" /></FormField>
                            <FormField label="Part Number"><input className={inputClass} placeholder="Manufacturer part no" /></FormField>
                            <FormField label="Category"><select className={selectClass}><option>Pump</option><option>Valve</option><option>Generator</option><option>Instrument</option><option>Pipeline</option><option>Chemical</option></select></FormField>
                            <FormField label="Quantity"><input type="number" className={inputClass} placeholder="0" /></FormField>
                            <FormField label="Minimum Qty"><input type="number" className={inputClass} placeholder="Reorder level" /></FormField>
                            <FormField label="Unit Cost (₹)"><input type="number" className={inputClass} placeholder="0" /></FormField>
                            <FormField label="Vendor"><select className={selectClass}>{mockVendors.map(v => <option key={v.id}>{v.name}</option>)}</select></FormField>
                            <FormField label="Store Location"><input className={inputClass} placeholder="Store A / B" /></FormField>
                        </FormSection>
                    ) : (
                        <FormSection title="Vendor Details" columns={2}>
                            <FormField label="Company Name" required><input className={inputClass} placeholder="Full name" /></FormField>
                            <FormField label="Category"><input className={inputClass} placeholder="e.g. Pumps & Valves" /></FormField>
                            <FormField label="Contact Phone"><input className={inputClass} placeholder="+91-" /></FormField>
                            <FormField label="Email"><input type="email" className={inputClass} placeholder="email@company.com" /></FormField>
                            <FormField label="City"><input className={inputClass} placeholder="City" /></FormField>
                            <FormField label="Rating"><select className={selectClass}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></FormField>
                        </FormSection>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                        <button type="button" onClick={() => setIsFormOpen(false)} style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: '#fff', cursor: 'pointer', color: '#374151' }}>Cancel</button>
                        <button type="submit" className="gradient-blue" style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
                    </div>
                </form>
            </SlideOverPanel>
        </div>
    );
}
