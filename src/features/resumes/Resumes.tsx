import { resumeApi } from "@/api/client"
import FileUploader from "@/components/shared/FileUploader";
import Button from "@/components/ui/Button";
import ResumeCard from "@/components/ui/ResumeCard";
import { useResumeStore, type Resume } from "@/store/resumeStore"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";

export default function Resumes() {

    const { savedResumes, addResume, setResumes, removeResume } = useResumeStore();

    const [resumeFile, setResumeFile] = useState<File>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const getResumes = async () => {
            try {
                setIsPageLoading(true);
                const response = await resumeApi.getAll();
                setResumes(response.data);
            }
            catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch resumes.")
                console.error("Failed to fetch resumes", err);
            }
            finally {
                setIsPageLoading(false);
            }
        }
        getResumes()
    }, [setResumes])

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!resumeFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', resumeFile)

        try {
            const response = await resumeApi.saveResume(formData);
            addResume(response.data);
            setResumeFile(null);
            toast.success("Resume uploaded successfully!");
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload resume. Please check the file type.");
            console.error("Failed to upload resume", err);
        }
        finally {
            setIsUploading(false);
        }
    }

    async function downloadResume(resume: Resume) {
        try {
            const response = await resumeApi.download(resume.id);
            window.open(import.meta.env.VITE_API_BASE_URL + response.data.url, '_blank');
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to download the resume.");
            console.error("Failed to download resume", err);
        }
    }

    async function deleteResume(resume: Resume) {
        try {
            await resumeApi.delete(resume.id);
            removeResume(resume);
            toast.success("Resume deleted.");
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete the resume.");
            console.error("Failed to delete resume", err);
        }
    }

    if (isPageLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto p-4">
                <div className="h-8 bg-surface rounded w-48 mb-6 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-24 bg-surface border border-outline rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-main">Saved Resumes</h1>
                    <p className="text-subtle text-sm mt-1">
                        Manage your resumes for quick JD evaluations.
                    </p>
                </div>
                <div className="bg-surface px-4 py-2 rounded-full border border-outline text-sm font-medium">
                    <span className={savedResumes.length >= 5 ? "text-red-500" : "text-brand"}>
                        {savedResumes.length}
                    </span>
                    <span className="text-subtle"> / 5 Uploaded</span>
                </div>
            </div>

            {savedResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedResumes.map(resume => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            onDownload={downloadResume}
                            onDelete={deleteResume}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-surface border border-outline rounded-2xl border-dashed">
                    <h3 className="text-lg font-semibold text-main mb-2">No resumes yet</h3>
                    <p className="text-subtle mb-6 max-w-sm mx-auto">
                        Upload your first resume below so you can easily evaluate it against job descriptions.
                    </p>
                </div>
            )}

            <div className="bg-surface border border-outline rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-main mb-4">
                    {savedResumes.length < 5 ? "Upload New Resume" : "Storage Limit Reached"}
                </h2>

                {savedResumes.length < 5 ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
                        <FileUploader
                            onFileSelect={setResumeFile}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={!resumeFile || isUploading}>
                                {isUploading ? 'Uploading...' : 'Upload Resume'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-subtle bg-background p-4 rounded-lg">
                        You have reached the maximum limit of 5 resumes. Please delete an existing resume to upload a new one.
                    </p>
                )}
            </div>

        </div>
    )
}