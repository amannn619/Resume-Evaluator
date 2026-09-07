import type { ReactNode } from "react";

interface ScoreCardProps {
    score: number,
    children: ReactNode
}

export default function ScoreCard({ score, children }: ScoreCardProps) {
    const isGoodScore = score >= 80;
    const scoreColor = isGoodScore ? 'text-success' : 'text-error';

    return (
        <div className="p-6 bg-surface border border-outline rounded-xl mt-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline pb-4">
                <h2 className="text-xl font-bold text-main">Match Score</h2>
                <span className={`text-3xl font-extrabold ${scoreColor}`}>
                    {score}<span className="text-lg text-subtle font-normal">/100</span>
                </span>
            </div>

            {children}
        </div>
    )
}