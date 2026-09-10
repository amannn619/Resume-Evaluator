import { useState } from "react";
import JobDescriptionInput from "@features/home/JobDescriptionInput";
import FileUploader from "@/components/shared/FileUploader";
import { resumeApi } from "@/api/client";
import ScoreCard from "@/components/shared/ScoreCard";
import SuggestionList from "@/components/shared/SuggestionList";

export default function Home() {
    const [jobDescription, setJobDescription] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File>(null);
    const [jdError, setJdError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [apiError, setApiError] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setJdError("");
        setApiError("");
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

        console.log('Sending FormData to API...');
        setIsLoading(true);

        try {
            const result = await resumeApi.evaluate(formData);
            setApiResponse(result.data);
        }
        catch (err) {
            console.log(err);
            setApiError("Failed to analyze resume. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-main">AI Resume Evaluator</h1>
            <p>Compare your resume against a job description.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">

                <JobDescriptionInput
                    value={jobDescription}
                    error={jdError}
                    onTextChange={setJobDescription}
                />

                <FileUploader accept=".pdf" maxSizeMB={1} onFileSelect={setResumeFile} />

                {apiError && (
                    <div className="p-4 bg-error/10 border border-error rounded-lg text-error">
                        {apiError}
                    </div>
                )}
                {apiResponse && (
                    <ScoreCard score={apiResponse.score}>
                        <SuggestionList suggestions={apiResponse.improvements} />
                    </ScoreCard>
                )}

                <button
                    type="submit"
                    className="px-6 py-3 mt-2 font-semibold rounded-lg bg-brand text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!jobDescription || !resumeFile || isLoading}
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        'Evaluate Now'
                    )}
                </button>
            </form>
        </div>
    );
}