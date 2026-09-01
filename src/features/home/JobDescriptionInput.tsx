interface JDInputProps {
    value: string;
    error?: string;
    onTextChange: (text: string) => void
}

export default function JobDescriptionInput({ value, error, onTextChange }: JDInputProps) {

    return (
        <div className="flex flex-col">
            <label className="mb-2 font-bold text-main">Job Description</label>
            <textarea
                placeholder="Paste at least 50 characters..."
                rows={6}
                value={value}
                onChange={(e) => onTextChange(e.target.value)}
                className={`w-full p-3 border rounded-lg bg-surface text-main resize-y focus:outline-none focus:ring-2 transition-shadow ${error
                    ? 'border-error focus:ring-error/50'
                    : 'border-outline focus:ring-brand/50'
                    }`}
            />
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    )
}