import { ReactNode, ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface FormSectionProps {
    title: string;
    icon?: IconType;
    children: ReactNode;
    columns?: 1 | 2;
}

export default function FormSection({ title, icon: Icon, children, columns = 1 }: FormSectionProps) {
    return (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px', overflow: 'hidden' }}>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                {Icon && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: '14px', height: '14px', color: '#4f46e5' }} />
                    </div>
                )}
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.075em', margin: 0 }}>{title}</h3>
            </div>
            {/* Section Body */}
            <div style={{
                padding: '24px 28px',
                ...(columns === 2 ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 24px' } : {})
            }}>
                {children}
            </div>
        </div>
    );
}
