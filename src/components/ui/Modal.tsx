import { cn } from "@/utils/cn";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;

    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    position?: 'top' | 'center' | 'bottom';
    closeOnOutsideClick?: boolean;
    closeOnEsc?: boolean;
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] min-h-[90vh]",
};

const positionStyles = {
    top: "items-start pt-16 md:pt-24",
    center: "items-center",
    bottom: "items-end pb-8",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = 'md',
    position = 'center',
    closeOnOutsideClick = true,
    closeOnEsc = true
}: ModalProps) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape" && closeOnEsc) {
                    onClose();
                }
            };
            document.addEventListener("keydown", handleEscape);

            return () => {
                document.body.style.overflow = "unset";
                document.removeEventListener("keydown", handleEscape);
            };
        }
    }, [isOpen, onClose, closeOnEsc])

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (closeOnOutsideClick) {
            onClose();
        }
    };

    return createPortal(
        <div className={cn("fixed inset-0 z-[999] flex justify-center p-4", positionStyles[position])}>

            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            <div
                className={cn(
                    "relative w-full max-h-[90vh] bg-surface border border-outline rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                    sizeStyles[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-outline shrink-0">
                    <h2 className="text-lg font-semibold text-main">{title}</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-subtle hover:text-main hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-outline-focus"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>,
        document.body)
}