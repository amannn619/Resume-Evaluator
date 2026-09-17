interface SuggestionListProps {
    title: string;
    items: string[];
    type: "success" | "warning" | "info";
}

export default function SuggestionList({ title, items, type }: SuggestionListProps) {
    if (!items || items.length === 0) return null;

    const config = {
        success: {
            bg: "bg-green-500/10",
            iconColor: "text-green-500",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        warning: {
            bg: "bg-yellow-500/10",
            iconColor: "text-yellow-600 dark:text-yellow-500",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        info: {
            bg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    };

    const style = config[type];

    return (
        <div>
            <h4 className="font-semibold text-main mb-3 flex items-center gap-2">
                <span className={`${style.bg} ${style.iconColor} p-1 rounded-md`}>
                    {style.icon}
                </span>
                {title}
            </h4>

            <ul className="space-y-2 pl-2">
                {items.map((item, index) => (
                    <li key={index} className="flex gap-3 text-sm text-subtle">
                        <span className="text-brand shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}