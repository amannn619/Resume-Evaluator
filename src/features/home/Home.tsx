import { useEffect, useState } from "react";
import JobDescriptionInput from "@features/home/JobDescriptionInput";
import FileUploader from "@/components/shared/FileUploader";
import { evaluationApi } from "@/api/client";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useResumeStore } from "@/store/resumeStore";
import { useAuthStore } from "@/store/authStore";
import type Resume from "@/interfaces/Resume";
import Result from "@/components/shared/Result";
import type AiResponse from "@/interfaces/AiResponse";
import { useDashboardStore } from "@/store/dashboardStore";

export default function Home() {
    const user = useAuthStore(state => state.user);
    const savedResumes = useResumeStore(state => state.savedResumes);
    const isResumeLoading = useResumeStore(state => state.isLoading);

    const setHasFetched = useDashboardStore(state => state.setHasFetched);

    const [jobDescription, setJobDescription] = useState<string>("");
    const [jdError, setJdError] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [apiResponse, setApiResponse] = useState<AiResponse | null>(null);

    const [activeTab, setActiveTab] = useState<"upload" | "saved">("upload");
    const [selectedResume, setSelectedResume] = useState<Resume>(null);

    useEffect(() => {
        if (!user) {
            setActiveTab('upload');
        }
    }, [user])

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setJdError("");
        setApiResponse(null);

        if (jobDescription.length < 50) {
            setJdError("Job description must be at least 50 characters.");
            return;
        }
        if (activeTab == 'upload' ? !resumeFile : !selectedResume) {
            alert("Please select a valid resume file.");
            return;
        }

        setIsLoading(true);
        try {
            if (activeTab == "saved") {
                const result = await evaluationApi.evaluateSaved(selectedResume.id, jobDescription);
                setApiResponse(result.data);
                setHasFetched(false);
            }
            else {
                const formData = new FormData();
                formData.append('resume', resumeFile);
                formData.append('description', jobDescription);
                const result = await evaluationApi.evaluate(formData);
                setApiResponse(result.data);
            }

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
                    <div className="space-y-4">
                        <div className="flex border-b border-outline">
                            <button
                                type="button"
                                onClick={() => setActiveTab("upload")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "upload"
                                    ? "border-brand text-brand"
                                    : "border-transparent text-subtle hover:text-main"
                                    }`}
                            >
                                Upload New
                            </button>

                            <button
                                type="button"
                                disabled={isResumeLoading || !user}
                                onClick={() => setActiveTab("saved")}
                                className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeTab === "saved"
                                    ? "border-brand text-brand"
                                    : "border-transparent text-subtle hover:text-main disabled:opacity-50 disabled:cursor-not-allowed"
                                    }`}
                            >
                                Choose Saved
                                {!user && (
                                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className="pt-2 min-h-[120px]">
                            {activeTab === "upload" ? (
                                <FileUploader
                                    onFileSelect={setResumeFile}
                                    currentFile={resumeFile}
                                />
                            ) : (
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    {savedResumes.length === 0 ? (
                                        <p className="text-sm text-subtle italic text-center py-4">
                                            You haven't saved any resumes yet.
                                        </p>
                                    ) : (
                                        savedResumes.map((resume) => (
                                            <button
                                                key={resume.id}
                                                type="button"
                                                onClick={() => setSelectedResume(resume)}
                                                className={`w-full text-left p-3 rounded-xl border transition-all ${selectedResume?.id === resume.id
                                                    ? "border-brand bg-brand/5 text-brand"
                                                    : "border-outline bg-background text-main hover:border-brand/50"
                                                    }`}
                                            >
                                                <div className="text-sm font-semibold truncate">{resume.fileName}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading || !jobDescription || (activeTab == 'upload' ? !resumeFile : !selectedResume)}
                        >
                            {isLoading ? 'Processing Evaluation...' : 'Evaluate Match'}
                        </Button>
                    </div>
                </form>
            </div>

            {apiResponse && (
                <Result aiResponse={apiResponse} />
            )}

        </div>
    );
}