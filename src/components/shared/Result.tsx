import type AiResponse from "@/interfaces/AiResponse"
import ScoreCard from "./ScoreCard"
import SuggestionList from "./SuggestionList"

interface ResultProps {
    aiResponse: AiResponse
}

export default function Result({ aiResponse }: ResultProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-main mb-4 px-2">
                Evaluation Results
            </h2>
            <ScoreCard
                score={aiResponse.score}
                experience={aiResponse.detectedExperience}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline pb-6">
                    <SuggestionList
                        title="Key Strengths"
                        items={aiResponse.strengths}
                        type="success"
                    />
                    <SuggestionList
                        title="Missing Keywords"
                        items={aiResponse.missingKeywords}
                        type="warning"
                    />
                </div>

                <div className="pt-2">
                    <SuggestionList
                        title="Actionable Improvements"
                        items={aiResponse.improvements}
                        type="info"
                    />
                </div>
            </ScoreCard>
        </div>
    )
}