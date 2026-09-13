import { useState } from "react";
import JobDescriptionInput from "@features/home/JobDescriptionInput";
import FileUploader from "@/components/shared/FileUploader";
import { resumeApi } from "@/api/client";
import ScoreCard from "@/components/shared/ScoreCard";
import SuggestionList from "@/components/shared/SuggestionList";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface EvaluationResponse {
    score: number;
    detected_experience: string;
    strengths: string[];
    missing_keywords: string[];
    improvements: string[];
}

export default function Home() {
    const [jobDescription, setJobDescription] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File>(null);
    const [jdError, setJdError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState<EvaluationResponse | null>(null);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setJdError("");
        setApiResponse(null);

        if (jobDescription.length < 50) {
            setJdError("Job description must be at least 50 characters.");
            return;
        }
        if (!resumeFile) {
            alert("Please select a valid resume file.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('description', jobDescription);
        setIsLoading(true);

        try {
            const result = await resumeApi.evaluate(formData);
            setApiResponse(result.data);
            toast.success("Evaluation complete!");
        }
        catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to evaluate resume. Please check your connection and try again."
            );
            console.error("Failed to evaluate resume", err);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">

            <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold text-main">AI Resume Evaluator</h1>
                <p className="text-subtle">
                    Upload your resume and paste a job description to instantly see how well you match.
                </p>
            </div>

            <div className="bg-surface border border-outline rounded-2xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <JobDescriptionInput
                        value={jobDescription}
                        error={jdError}
                        onTextChange={setJobDescription}
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-main">
                            Your Resume
                        </label>
                        <FileUploader onFileSelect={setResumeFile} />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={!jobDescription || !resumeFile || isLoading}
                        >
                            {isLoading ? 'Processing Evaluation...' : 'Evaluate Match'}
                        </Button>
                    </div>
                </form>
            </div>

            {apiResponse && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-bold text-main mb-4 px-2">
                        Evaluation Results
                    </h2>
                    <ScoreCard
                        score={apiResponse.score}
                        experience={apiResponse.detected_experience}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline pb-6">
                            <SuggestionList
                                title="Key Strengths"
                                items={apiResponse.strengths}
                                type="success"
                            />
                            <SuggestionList
                                title="Missing Keywords"
                                items={apiResponse.missing_keywords}
                                type="warning"
                            />
                        </div>

                        <div className="pt-2">
                            <SuggestionList
                                title="Actionable Improvements"
                                items={apiResponse.improvements}
                                type="info"
                            />
                        </div>
                    </ScoreCard>
                </div>
            )}

        </div>
    );
}