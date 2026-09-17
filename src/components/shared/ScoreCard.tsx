import type { ReactNode } from "react";

interface ScoreCardProps {
    score: number;
    experience: string;
    children?: ReactNode;
}

export default function ScoreCard({ score, experience, children }: ScoreCardProps) {
    const scoreColor =
        score >= 80 ? "text-green-500" :
            score >= 60 ? "text-yellow-500" : "text-red-500";

    return (
        <div className="bg-surface border border-outline rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-outline pb-6">

                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 border-outline shrink-0">
                    <span className={`text-3xl font-bold ${scoreColor}`}>
                        {score}
                    </span>
                    <span className="absolute -bottom-2 bg-surface border border-outline px-2 py-0.5 rounded-full text-[10px] font-bold text-subtle uppercase tracking-wider">
                        Match
                    </span>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h3 className="text-xl font-bold text-main">Evaluation Complete</h3>
                    <p className="text-subtle mt-1">
                        Based on the job description, the AI detected
                        <span className="font-semibold text-main mx-1">{experience}</span>
                        of relevant experience.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </div>
    )
}