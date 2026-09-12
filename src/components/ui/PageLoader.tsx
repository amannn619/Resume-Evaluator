import logoIcon from "../../assets/logo.svg";

interface PageLoaderProps {
    isFading: boolean;
}

export default function PageLoader({ isFading }: PageLoaderProps) {
    return (
        <div className={`fixed inset-0 z-[9999] bg-background/50 flex flex-col items-center justify-center transition-opacity duration-400 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}>
            <img
                src={logoIcon}
                alt="Loading..."
                className="w-12 h-12 animate-pulse mb-4"
            />
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    )
}