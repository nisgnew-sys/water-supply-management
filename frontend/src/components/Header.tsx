import { Bell, Search, Settings, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard Overview',
    '/dashboard/gis': 'GIS Network Map',
    '/dashboard/production/sources': 'Water Sources',
    '/dashboard/production/treatment-plants': 'Treatment Plants',
    '/dashboard/production/storage-tanks': 'Storage Tanks',
    '/dashboard/distribution': 'Distribution Network',
    '/dashboard/distribution/gis-network': 'GIS Network Registry',
    '/dashboard/distribution/supply-ops': 'Pipeline & Supply Operations',
    '/dashboard/distribution/leakage-nrw': 'Leakage & NRW Management',
    '/dashboard/distribution/pressure-monitoring': 'Pressure & Flow Monitoring',
    '/dashboard/distribution/reservoirs': 'Reservoirs',
    '/dashboard/distribution/valves': 'Valves & Meters',
    '/dashboard/distribution/pipelines': 'Pipelines',
    '/dashboard/consumers': 'Consumer Management',
    '/dashboard/assets': 'Asset Management',
    '/dashboard/finance/revenue': 'Revenue Collection & Monitoring',
    '/dashboard/finance/expenditure': 'Expenditure Tracking',
    '/dashboard/finance/budgeting': 'Budgeting & Cost Recovery',
    '/dashboard/finance/reports': 'Financial Reporting',
};

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const pageTitle = pageTitles[location.pathname] || 'Water Supply Management';

    return (
        <header style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f3f4f6', padding: '16px 28px', position: 'sticky', top: 0, zIndex: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ padding: '2px 0' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.01em', margin: 0 }}>{pageTitle}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <CalendarDays style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                        <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500, margin: 0 }}>
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder=""
                            className="pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white w-60 transition-all hover:border-gray-300"
                        />
                    </div>
                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full pulse-dot" />
                    </button>
                    {/* Settings */}
                    <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                        <Settings className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
        </header>
    );
}
