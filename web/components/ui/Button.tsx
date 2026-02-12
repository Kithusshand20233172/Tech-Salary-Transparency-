import { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({ children, className = '', variant = 'primary', isLoading, ...props }) => {
    const baseStyles = 'relative inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-black text-white hover:bg-zinc-800 focus:ring-zinc-500 shadow-sm',
        secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-300',
        outline: 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-500',
        ghost: 'text-zinc-600 hover:bg-zinc-50 focus:ring-zinc-200',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={isLoading || props.disabled} {...props}>
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
