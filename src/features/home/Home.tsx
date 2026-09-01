import { useState } from "react";
import JobDescriptionInput from "@features/home/JobDescriptionInput";
import FileUploader from "@/components/shared/FileUploader";

export default function Home() {
    const [jobDescription, setJobDescription] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File>(null);
    const [jdError, setJdError] = useState("");

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setJdError("");

        if (jobDescription.length < 50) {
            setJdError("Job description must be at least 50 characters.");
            console.log("Job description must be at least 50 characters.")
            return;
        }
        if (!resumeFile) {
            alert("Please select a valid resume file.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jdText', jobDescription);

        console.log('Sending FormData to API...');
        formData.forEach((value, key) => {
            console.log(`${key} => `, value);
        })

        alert('Validation passed! Ready for Day 6 Data Fetching.');
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

                <button
                    type="submit"
                    className="px-6 py-3 mt-2 font-semibold rounded-lg bg-brand text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!jobDescription || !resumeFile}
                >
                    Evaluate Resume
                </button>
            </form>
        </div>
    );
}