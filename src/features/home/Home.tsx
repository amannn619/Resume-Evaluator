import { useState } from "react";
import JobDescriptionInput from "@features/home/JobDescriptionInput";
import ResumeUploader from "@features/home/ResumeUploader";

export default function Home() {
    const [jobDescription, setJobDescription] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File>(null);
    const onEvaluate = () => {
        console.log(`JD: ${jobDescription}`);
        console.log(`File Name: ${resumeFile.name}`);
    };

    return (
        <div>
            <h1>AI Resume Evaluator</h1>
            <p>Compare your resume against a job description.</p>

            <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                <JobDescriptionInput
                    value={jobDescription}
                    onTextChange={setJobDescription}
                />
                <ResumeUploader onFileSelect={setResumeFile} />
            </div>

            <button
                style={{ display: "block", marginTop: "10px" }}
                disabled={!jobDescription || !resumeFile}
                onClick={onEvaluate}>
                Evaluate Resume
            </button>

            <div
                style={{
                    marginTop: "2rem",
                    textAlign: "left",
                    padding: "1rem",
                }}>
                <p>
                    <strong>Debug State:</strong>
                </p>
                <p>JD Length: {jobDescription.length} characters</p>
                <p>Selected File: {resumeFile ? resumeFile.name : "None"}</p>
            </div>
        </div>
    );
}