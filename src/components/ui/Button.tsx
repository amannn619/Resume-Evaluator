import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children?: React.ReactNode;
    onClick?: () => void;
}
export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const variantStyles = {
        primary: 'bg-brand text-inverse hover:opacity-90 border border-transparent',
        secondary: 'bg-surface text-main hover:bg-hover border border-transparent',
        outline: 'bg-transparent text-main border border-outline hover:bg-surface hover:border-outline-focus'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const baseStyles = 'font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            className={
                cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )
            }
            {...props}
        >
            {children}
        </button>
    )
}