import { resumeApi } from "@/api/client"
import FileUploader from "@/components/shared/FileUploader";
import Button from "@/components/ui/Button";
import { useResumeStore } from "@/store/resumeStore"
import { useEffect, useState } from "react"

export default function Resumes() {
    const savedResumes = useResumeStore((state) => state.savedResumes);
    const addResume = useResumeStore((state) => state.addResume);
    const [resumeFile, setResumeFile] = useState<File>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const getResumes = async () => {
            try {
                setIsLoading(true)
                setError('');
                const response = await resumeApi.getAll();
                console.log(response)
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
    }, [savedResumes])

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setIsLoading(false);
        setError('');

        const formData = new FormData();
        formData.append('resume', resumeFile)

        try {
            const response = await resumeApi.saveResume(formData);
            addResume({
                id: response.data.id,
                userId: response.data.user_id,
                createdAt: response.data.created_at,
                fileName: response.data.file_name
            })
            console.log(savedResumes)
        }
        catch (err) {
            setError("Cannot uplaod resume")
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            {savedResumes.length == 0 && (
                <p>You can save upto 5 resumes</p>
            )}

            {savedResumes.length < 5 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
                    <FileUploader onFileSelect={setResumeFile}></FileUploader>
                    <Button type='submit' disabled={resumeFile == null}>
                        {isLoading ? 'Uploading' : 'Upload'}
                    </Button>
                </form>
            )}
        </>
    )
}