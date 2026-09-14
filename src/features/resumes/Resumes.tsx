import { resumeApi } from "@/api/client"
import FileUploader from "@/components/shared/FileUploader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ResumeCard from "@/components/ui/ResumeCard";
import type Resume from "@/interfaces/Resume";
import { useResumeStore } from "@/store/resumeStore"
import { useState } from "react"
import { toast } from "react-hot-toast";

export default function Resumes() {
    const savedResumes = useResumeStore(state => state.savedResumes);
    const isResumeLoading = useResumeStore(state => state.isLoading);
    const addResume = useResumeStore(state => state.addResume);
    const removeResume = useResumeStore(state => state.removeResume);
    const updateResume = useResumeStore(state => state.updateResume);

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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
            window.open(response.data.url, '_blank');
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to download the resume.");
            console.error("Failed to download resume", err);
        }
    }


    const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
    const [resumeToReplace, setResumeToReplace] = useState<Resume | null>(null);
    const [replaceFile, setReplaceFile] = useState<File | null>(null);
    const [isReplacing, setIsReplacing] = useState(false);
    async function openReplaceModal(resume: Resume) {
        console.log(resume)
        setResumeToReplace(resume);
        setReplaceFile(null);
        setIsReplaceModalOpen(true);
    }

    async function handleReplaceSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        if (!replaceFile || !resumeToReplace) return;

        setIsReplacing(true);
        const formData = new FormData();
        formData.append('resume', replaceFile);

        try {
            const response = await resumeApi.update(resumeToReplace.id, formData);

            updateResume(response.data);
            toast.success("Resume replaced successfully!");

            setIsReplaceModalOpen(false);
            setResumeToReplace(null);
            setReplaceFile(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to replace resume.");
            console.error("Failed to replace resume", err);
        } finally {
            setIsReplacing(false);
        }
    }

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    function openDeleteModal(resume: Resume) {
        setResumeToDelete(resume);
        setIsDeleteModalOpen(true);
    }
    async function handleConfirmDelete() {
        if (!resumeToDelete) return;

        setIsDeleting(true);
        try {
            await resumeApi.delete(resumeToDelete.id);
            removeResume(resumeToDelete);
            toast.success("Resume deleted.");

            setIsDeleteModalOpen(false);
            setResumeToDelete(null);
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete the resume.");
            console.error("Failed to delete resume", err);
        }
        finally {
            setIsDeleting(false);
        }
    }

    if (isResumeLoading) {
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
                            onUpdate={openReplaceModal}
                            onDelete={openDeleteModal}
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <FileUploader
                            currentFile={resumeFile}
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

            <Modal
                isOpen={isReplaceModalOpen}
                onClose={() => !isReplacing && setIsReplaceModalOpen(false)}
                title={`Replace "${resumeToReplace?.fileName}"`}
                closeOnOutsideClick={false}
                closeOnEsc={false}
            >
                <form onSubmit={handleReplaceSubmit} className="flex flex-col gap-6">
                    <p className="text-sm text-subtle">
                        Select a new file to overwrite this resume. This action cannot be undone.
                    </p>

                    <FileUploader
                        currentFile={replaceFile}
                        onFileSelect={setReplaceFile}
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsReplaceModalOpen(false)}
                            disabled={isReplacing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!replaceFile || isReplacing}>
                            {isReplacing ? 'Replacing...' : 'Replace Resume'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Confirm Deletion"
                closeOnOutsideClick={false}
                closeOnEsc={false}
            >
                <div className="flex flex-col gap-6">

                    <div className="flex gap-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
                        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h4 className="font-bold mb-1">Warning: Irreversible Action</h4>
                            <p className="text-sm opacity-90 leading-relaxed">
                                You are about to delete <span className="font-semibold">{resumeToDelete?.fileName}</span>.
                                This will permanently remove the file and <span className="font-semibold underline">all evaluation history</span> associated with it.
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-error text-white hover:bg-error/90 border-transparent focus:ring-error/50"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Resume'}
                        </Button>
                    </div>
                </div>
            </Modal>

        </div >
    )
}