import { ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    children: ReactNode;
    hint?: string;
}

export default function FormField({ label, required, error, children, hint }: FormFieldProps) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>
                {label}
                {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
            </label>
            <div>{children}</div>
            {hint && !error && <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', lineHeight: 1.5, margin: '4px 0 0 0' }}>{hint}</p>}
            {error && <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px', fontWeight: 500, margin: '4px 0 0 0' }}>{error}</p>}
        </div>
    );
}

/** Styled input classes */
export const inputClass = "block w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 outline-none";
export const selectClass = "block w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white hover:border-gray-300 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 appearance-none cursor-pointer outline-none";
export const textareaClass = "block w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 focus:border-indigo-400 focus:ring-[3px] focus:ring-indigo-500/10 focus:bg-white transition-all duration-200 resize-none outline-none";
