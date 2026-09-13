import { resumeApi } from "@/api/client"
import FileUploader from "@/components/shared/FileUploader";
import Button from "@/components/ui/Button";
import ResumeCard from "@/components/ui/ResumeCard";
import { useResumeStore, type Resume } from "@/store/resumeStore"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";

export default function Resumes() {
    const savedResumes = useResumeStore((state) => state.savedResumes);
    const addResume = useResumeStore((state) => state.addResume);
    const setResumes = useResumeStore((state) => state.setResumes);
    const [resumeFile, setResumeFile] = useState<File>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getResumes = async () => {
            try {
                setIsLoading(true)
                setError('');
                const response = await resumeApi.getAll();
                setResumes(response.data);
            }
            catch (err) {
                console.log(err)
                debugger
                setError("Couldn't fetch resumes");
            }
            finally {
                setIsLoading(false)
            }
        }
        getResumes()
    }, [])

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setIsLoading(false);
        setError('');

        const formData = new FormData();
        formData.append('resume', resumeFile)

        try {
            const response = await resumeApi.saveResume(formData);
            addResume(response.data);
        }
        catch (err) {
            setError("Cannot uplaod resume")
        }
        finally {
            setIsLoading(false)
        }
    }

    async function downloadresume(resume: Resume) {
        try {
            const response = await resumeApi.get(resume.id);
            console.log(response)
            const blobUrl = URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${resume.fileName || 'resume'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }
        catch (err) {
            toast.error("Failed to download the PDF");
        }
        finally {

        }
    }


    return (
        <>
            {
                savedResumes.map(resume => {
                    return <ResumeCard onDownload={downloadresume} key={resume.id} resume={resume}></ResumeCard>
                })
            }
            {
                savedResumes.length == 0 && (
                    <p>You can save upto 5 resumes</p>
                )
            }

            {savedResumes.length < 5 && (
                < form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
                    <FileUploader onFileSelect={setResumeFile}></FileUploader>
                    <Button type='submit' disabled={resumeFile == null}>
                        {isLoading ? 'Uploading' : 'Upload'}
                    </Button>
                </form >
            )
            }
        </>
    )
}