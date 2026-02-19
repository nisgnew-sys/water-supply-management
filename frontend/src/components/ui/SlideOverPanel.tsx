import { X } from 'lucide-react';
import { ReactNode, useEffect, useState, ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

interface SlideOverPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    width?: string;
    icon?: IconType;
}

export default function SlideOverPanel({ isOpen, onClose, title, subtitle, children, icon: CustomIcon }: SlideOverPanelProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => setVisible(true));
        } else {
            document.body.style.overflow = '';
            setVisible(false);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div
                className={`relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${visible ? 'modal-content-enter' : 'opacity-0 scale-95'}`}
            >
                {/* Header — indigo gradient banner */}
                <div style={{ position: 'relative', padding: '24px 32px', background: 'linear-gradient(to right, #4f46e5, #6366f1, #7c3aed)', color: '#fff', overflow: 'hidden' }}>
                    {/* Decorative shapes */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(25%, -50%)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: '33%', width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translateY(50%)' }} />

                    <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {CustomIcon && (
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CustomIcon style={{ width: '20px', height: '20px', color: '#fff' }} />
                                </div>
                            )}
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>{title}</h2>
                                {subtitle && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '2px', margin: '2px 0 0 0' }}>{subtitle}</p>}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                        >
                            <X style={{ width: '20px', height: '20px', color: '#fff' }} />
                        </button>
                    </div>
                </div>

                {/* Body — scrollable with subtle background and generous padding */}
                <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fb' }}>
                    <div style={{ padding: '32px' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
