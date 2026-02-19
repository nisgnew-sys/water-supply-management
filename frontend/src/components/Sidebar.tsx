import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
    LayoutDashboard, Droplets, Factory, Map, Database,
    Users, Wrench, IndianRupee, ChevronDown,
    CircleDot, Truck, AlertTriangle, Gauge,
    LogOut, Shield, Settings,
    FilePlus2, ClipboardCheck, Zap, Activity, MessageSquare, Power,
    QrCode, Calendar, Package, Wallet, PiggyBank, FileBarChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── colour theme per section ── */
const SECTION_THEMES: Record<string, { accent: string; glow: string; iconBg: string; badge: string }> = {
    Overview: { accent: '#818cf8', glow: 'rgba(129,140,248,.12)', iconBg: 'rgba(129,140,248,.14)', badge: '#818cf8' },
    Production: { accent: '#22d3ee', glow: 'rgba(34,211,238,.10)', iconBg: 'rgba(34,211,238,.14)', badge: '#22d3ee' },
    Distribution: { accent: '#34d399', glow: 'rgba(52,211,153,.10)', iconBg: 'rgba(52,211,153,.14)', badge: '#34d399' },
    'Consumer Management': { accent: '#f472b6', glow: 'rgba(244,114,182,.10)', iconBg: 'rgba(244,114,182,.14)', badge: '#f472b6' },
    'Financial Management': { accent: '#fbbf24', glow: 'rgba(251,191,36,.10)', iconBg: 'rgba(251,191,36,.14)', badge: '#fbbf24' },
    Operations: { accent: '#fb923c', glow: 'rgba(251,146,60,.10)', iconBg: 'rgba(251,146,60,.14)', badge: '#fb923c' },
};

interface NavItem { name: string; href: string; icon: any }
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'GIS Map', href: '/dashboard/gis', icon: Map },
        ]
    },
    {
        label: 'Production',
        items: [
            { name: 'Water Sources', href: '/dashboard/production/sources', icon: Droplets },
            { name: 'Treatment Plants', href: '/dashboard/production/treatment-plants', icon: Factory },
            { name: 'Storage Tanks', href: '/dashboard/production/storage-tanks', icon: Database },
        ]
    },
    {
        label: 'Distribution',
        items: [
            { name: 'GIS Network Registry', href: '/dashboard/distribution/gis-network', icon: CircleDot },
            { name: 'Supply Operations', href: '/dashboard/distribution/supply-ops', icon: Truck },
            { name: 'Leakage & NRW', href: '/dashboard/distribution/leakage-nrw', icon: AlertTriangle },
            { name: 'Pressure Monitoring', href: '/dashboard/distribution/pressure-monitoring', icon: Gauge },
        ]
    },
    {
        label: 'Consumer Management',
        items: [
            { name: 'Consumer Database', href: '/dashboard/consumers', icon: Users },
            { name: 'New Connection', href: '/dashboard/consumers/new-connection', icon: FilePlus2 },
            { name: 'Site Survey', href: '/dashboard/consumers/survey', icon: ClipboardCheck },
            { name: 'Activation', href: '/dashboard/consumers/activation', icon: Zap },
            { name: 'Metering', href: '/dashboard/consumers/metering', icon: Activity },
            { name: 'Billing & Payment', href: '/dashboard/consumers/billing', icon: IndianRupee },
            { name: 'Complaints', href: '/dashboard/consumers/complaints', icon: MessageSquare },
            { name: 'Disconnect / Reconnect', href: '/dashboard/consumers/disconnection', icon: Power },
        ]
    },
    {
        label: 'Financial Management',
        items: [
            { name: 'Revenue Collection', href: '/dashboard/finance/revenue', icon: IndianRupee },
            { name: 'Expenditure Tracking', href: '/dashboard/finance/expenditure', icon: Wallet },
            { name: 'Budgeting & Cost Recovery', href: '/dashboard/finance/budgeting', icon: PiggyBank },
            { name: 'Financial Reporting', href: '/dashboard/finance/reports', icon: FileBarChart },
        ]
    },
    {
        label: 'Operations',
        items: [
            { name: 'Asset Overview', href: '/dashboard/assets', icon: Wrench },
            { name: 'Asset Inventory', href: '/dashboard/operations/inventory', icon: QrCode },
            { name: 'Preventive Maintenance', href: '/dashboard/operations/preventive', icon: Calendar },
            { name: 'Breakdown Maintenance', href: '/dashboard/operations/breakdown', icon: AlertTriangle },
            { name: 'Spare Parts & Vendors', href: '/dashboard/operations/spare-parts', icon: Package },
        ]
    },
];

/* ── Animated collapse wrapper ── */
function AnimatedPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | undefined>(open ? undefined : 0);

    useEffect(() => {
        if (!ref.current) return;
        if (open) {
            const h = ref.current.scrollHeight;
            setHeight(h);
            const t = setTimeout(() => setHeight(undefined), 250);
            return () => clearTimeout(t);
        } else {
            setHeight(ref.current.scrollHeight);
            requestAnimationFrame(() => setHeight(0));
        }
    }, [open]);

    return (
        <div style={{ height: height === undefined ? 'auto' : height, overflow: 'hidden', transition: 'height .25s cubic-bezier(.4,0,.2,1)' }}>
            <div ref={ref}>{children}</div>
        </div>
    );
}

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [hovered, setHovered] = useState<string | null>(null);

    const toggleGroup = (label: string) => {
        setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(href);
    };

    /* auto-expand group that contains active link */
    const hasActiveChild = (group: NavGroup) => group.items.some(i => isActive(i.href));

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '260px', height: '100%', minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a0f1e 0%, #111827 40%, #0f1629 100%)',
            borderRight: '1px solid rgba(255,255,255,.04)',
            fontFamily: "'Inter', -apple-system, sans-serif",
        }}>
            {/* ── Brand Header ── */}
            <div style={{ padding: '20px 18px 16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(99,102,241,.3), inset 0 1px 0 rgba(255,255,255,.15)',
                    }}>
                        <Droplets style={{ width: '20px', height: '20px', color: '#fff' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                            Water Supply
                        </h1>
                        <p style={{ fontSize: '11px', color: 'rgba(148,163,184,.7)', fontWeight: 500, margin: '1px 0 0 0' }}>
                            Management System
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Subtle divider ── */}
            <div style={{ margin: '0 16px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)' }} />

            {/* ── Navigation ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px 6px 10px' }} className="sidebar-scroll">
                {navGroups.map(group => {
                    const theme = SECTION_THEMES[group.label] || SECTION_THEMES.Overview;
                    const isOpen = !collapsed[group.label];
                    const groupActive = hasActiveChild(group);

                    return (
                        <div key={group.label} style={{ marginBottom: '4px' }}>
                            {/* Section header */}
                            <button
                                onClick={() => toggleGroup(group.label)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    background: groupActive && isOpen ? theme.glow : 'transparent',
                                    transition: 'background .2s',
                                }}
                                onMouseEnter={e => { if (!groupActive || !isOpen) e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = groupActive && isOpen ? theme.glow : 'transparent'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* Color pip */}
                                    <div style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: theme.accent,
                                        boxShadow: groupActive ? `0 0 6px ${theme.accent}` : 'none',
                                        transition: 'box-shadow .3s',
                                    }} />
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                        letterSpacing: '0.08em', color: groupActive ? theme.accent : 'rgba(148,163,184,.55)',
                                        transition: 'color .2s',
                                    }}>{group.label}</span>
                                    {/* Item count badge */}
                                    <span style={{
                                        fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px',
                                        background: 'rgba(255,255,255,.05)', color: 'rgba(148,163,184,.4)',
                                    }}>{group.items.length}</span>
                                </div>
                                <ChevronDown style={{
                                    width: '12px', height: '12px',
                                    color: 'rgba(148,163,184,.35)',
                                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                                    transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
                                }} />
                            </button>

                            {/* Animated items */}
                            <AnimatedPanel open={isOpen}>
                                <div style={{ padding: '2px 0 4px 0' }}>
                                    {group.items.map(item => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        const isHovered = hovered === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                onMouseEnter={() => setHovered(item.href)}
                                                onMouseLeave={() => setHovered(null)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px',
                                                    padding: '7px 10px', margin: '1px 0',
                                                    borderRadius: '9px', textDecoration: 'none',
                                                    background: active
                                                        ? `linear-gradient(135deg, ${theme.glow}, rgba(255,255,255,.03))`
                                                        : isHovered ? 'rgba(255,255,255,.03)' : 'transparent',
                                                    transition: 'all .15s ease',
                                                    position: 'relative',
                                                }}
                                            >
                                                {/* Active indicator bar */}
                                                {active && (
                                                    <div style={{
                                                        position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)',
                                                        width: '3px', height: '18px', borderRadius: '0 3px 3px 0',
                                                        background: theme.accent,
                                                        boxShadow: `0 0 8px ${theme.accent}`,
                                                    }} />
                                                )}

                                                {/* Icon container */}
                                                <div style={{
                                                    width: '30px', height: '30px', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    flexShrink: 0,
                                                    background: active ? theme.iconBg : 'transparent',
                                                    transition: 'background .15s',
                                                }}>
                                                    <Icon style={{
                                                        width: '15px', height: '15px',
                                                        color: active ? theme.accent : isHovered ? 'rgba(203,213,225,.8)' : 'rgba(148,163,184,.45)',
                                                        transition: 'color .15s',
                                                    }} />
                                                </div>

                                                {/* Label */}
                                                <span style={{
                                                    fontSize: '12.5px',
                                                    fontWeight: active ? 600 : 450,
                                                    color: active ? '#f1f5f9' : isHovered ? 'rgba(226,232,240,.9)' : 'rgba(148,163,184,.65)',
                                                    transition: 'color .15s',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                }}>{item.name}</span>

                                                {/* Active dot */}
                                                {active && (
                                                    <div style={{
                                                        marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%',
                                                        background: theme.accent,
                                                        boxShadow: `0 0 6px ${theme.accent}`,
                                                    }} />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </AnimatedPanel>
                        </div>
                    );
                })}
            </div>

            {/* ── Settings ── */}
            <div style={{ padding: '0 10px 4px 10px' }}>
                <Link to="/dashboard/settings" style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
                    borderRadius: '9px', textDecoration: 'none',
                    background: isActive('/dashboard/settings') ? 'rgba(129,140,248,.12)' : 'transparent',
                    transition: 'background .15s',
                }}
                    onMouseEnter={e => { if (!isActive('/dashboard/settings')) e.currentTarget.style.background = 'rgba(255,255,255,.03)'; }}
                    onMouseLeave={e => { if (!isActive('/dashboard/settings')) e.currentTarget.style.background = 'transparent'; }}
                >
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings style={{ width: '15px', height: '15px', color: 'rgba(148,163,184,.45)' }} />
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: 450, color: 'rgba(148,163,184,.65)' }}>Settings</span>
                </Link>
            </div>

            {/* ── Divider ── */}
            <div style={{ margin: '0 14px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)' }} />

            {/* ── User Footer ── */}
            <div style={{ padding: '10px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,.03), rgba(255,255,255,.01))',
                    border: '1px solid rgba(255,255,255,.04)',
                }}>
                    <div style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '13px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(99,102,241,.25)',
                    }}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#f1f5f9', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {user?.name || 'Admin'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                            <Shield style={{ width: '10px', height: '10px', color: '#818cf8' }} />
                            <p style={{ fontSize: '10px', color: 'rgba(129,140,248,.7)', fontWeight: 500, margin: 0 }}>
                                {user?.role || 'Administrator'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: 'transparent', transition: 'all .15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.12)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        title="Logout"
                    >
                        <LogOut style={{ width: '15px', height: '15px', color: 'rgba(148,163,184,.5)' }} />
                    </button>
                </div>
            </div>

            {/* ── Custom scrollbar styles ── */}
            <style>{`
                .sidebar-scroll::-webkit-scrollbar { width: 4px; }
                .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 4px; }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.15); }
            `}</style>
        </div>
    );
}
