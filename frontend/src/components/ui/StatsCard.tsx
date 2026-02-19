import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: IconType;
    gradient: 'blue' | 'green' | 'amber' | 'rose' | 'cyan' | 'purple' | 'teal' | 'orange';
    trend?: { value: string; positive: boolean };
    variant?: 'gradient' | 'outlined' | 'flat';
}

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, trend, variant = 'gradient' }: StatsCardProps) {
    if (variant === 'outlined') {
        const borderColors: Record<string, string> = {
            blue: 'border-indigo-200 bg-indigo-50/30',
            green: 'border-emerald-200 bg-emerald-50/30',
            amber: 'border-amber-200 bg-amber-50/30',
            rose: 'border-rose-200 bg-rose-50/30',
            cyan: 'border-cyan-200 bg-cyan-50/30',
            purple: 'border-purple-200 bg-purple-50/30',
            teal: 'border-teal-200 bg-teal-50/30',
            orange: 'border-orange-200 bg-orange-50/30',
        };
        const iconColors: Record<string, string> = {
            blue: 'text-indigo-600 bg-indigo-100', green: 'text-emerald-600 bg-emerald-100',
            amber: 'text-amber-600 bg-amber-100', rose: 'text-rose-600 bg-rose-100',
            cyan: 'text-cyan-600 bg-cyan-100', purple: 'text-purple-600 bg-purple-100',
            teal: 'text-teal-600 bg-teal-100', orange: 'text-orange-600 bg-orange-100',
        };
        return (
            <div className={`rounded-xl border ${borderColors[gradient]} card-interactive`} style={{ padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div className={`p-2 rounded-lg ${iconColors[gradient]}`}>
                        <Icon style={{ width: '16px', height: '16px' }} />
                    </div>
                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{title}</p>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>{value}</h3>
                    {subtitle && <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{subtitle}</p>}
                </div>
                {trend && (
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: trend.positive ? '#059669' : '#e11d48' }}>
                        {trend.positive ? <TrendingUp style={{ width: '12px', height: '12px', marginRight: '3px' }} /> : <TrendingDown style={{ width: '12px', height: '12px', marginRight: '3px' }} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'flat') {
        const dotColors: Record<string, string> = {
            blue: 'bg-indigo-500', green: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500',
            cyan: 'bg-cyan-500', purple: 'bg-purple-500', teal: 'bg-teal-500', orange: 'bg-orange-500',
        };
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 card-interactive" style={{ padding: '14px 18px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                    <div className={`w-2 h-2 rounded-full ${dotColors[gradient]}`} />
                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{title}</p>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', margin: '0 0 2px 0', lineHeight: 1.2 }}>{value}</h3>
                {subtitle && <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{subtitle}</p>}
                {trend && (
                    <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: trend.positive ? '#059669' : '#e11d48' }}>
                        {trend.positive ? <TrendingUp style={{ width: '12px', height: '12px', marginRight: '3px' }} /> : <TrendingDown style={{ width: '12px', height: '12px', marginRight: '3px' }} />}
                        <span>{trend.value}</span>
                    </div>
                )}
            </div>
        );
    }

    // Default: gradient variant — compact center-aligned
    return (
        <div className={`stat-card gradient-${gradient} shadow-lg card-interactive`} style={{ textAlign: 'center', padding: '14px 18px' }}>
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', backdropFilter: 'blur(8px)' }}>
                    <Icon style={{ width: '16px', height: '16px', color: '#fff' }} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{title}</p>
                <h3 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>{value}</h3>
                {subtitle && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', margin: 0 }}>{subtitle}</p>}
            </div>
            {trend && (
                <div style={{ position: 'relative', zIndex: 10, marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500 }}>
                    {trend.positive ? <TrendingUp style={{ width: '12px', height: '12px', marginRight: '3px' }} /> : <TrendingDown style={{ width: '12px', height: '12px', marginRight: '3px' }} />}
                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>{trend.value}</span>
                </div>
            )}
        </div>
    );
}
