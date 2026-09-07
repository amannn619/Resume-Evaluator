interface SuggestionListProps {
    suggestions: string[]
}

export default function SuggestionList({ suggestions }: SuggestionListProps) {
    if (!suggestions || suggestions.length == 0) return null;

    return (
        <div className="mt-4">
            <h3 className="font-bold text-main mb-2">How to improve:</h3>
            <ul className="list-disc pl-5 text-subtle space-y-1">
                {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
    )
}