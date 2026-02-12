import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => {
    return (
        <div className="w-full space-y-1">
            {label && <label className="text-sm font-medium text-zinc-700 ml-0.5">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full transition-all duration-150
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2 
            bg-white border border-zinc-200 rounded-lg outline-none
            focus:border-black focus:ring-0
            placeholder:text-zinc-400 text-zinc-900
            ${error ? 'border-red-500 bg-red-50/10' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs font-medium text-red-500 ml-0.5">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
