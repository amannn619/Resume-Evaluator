import type { ChangeEvent } from "react";

interface ResumeInputProps {
    onFileSelect: (file: File) => void
}

export default function ResumeUploader(props: ResumeInputProps) {
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        props.onFileSelect(file);
    }

    return (
        <div className="card">
            <h2>Upload Resume</h2>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} />
        </div>
    )
}