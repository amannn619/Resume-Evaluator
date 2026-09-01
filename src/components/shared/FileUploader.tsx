import type { ChangeEvent } from "react";
import { useState } from "react";

interface FileUploaderInputProps {
    accept: string;
    maxSizeMB: number;
    onFileSelect: (file: File | null) => void
}

export default function FileUploader({ accept, maxSizeMB, onFileSelect }: FileUploaderInputProps) {
    const [error, setError] = useState("");
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        setError("");
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const size = file.size / (1024 * 1024);
            console.log(size)
            if (size > maxSizeMB) {
                setError(`File must be smaller than ${maxSizeMB}MB.`);
                onFileSelect(null);
                e.target.value = "";
                return;
            }
        }
        onFileSelect(file);
    };

    return (
        <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Upload Resume
            </label>
            <input type="file" accept={accept} onChange={handleFileSelect} />

            {error && <p style={{ color: 'red', margin: '8px 0 0' }}>{error}</p>}
        </div>
    )
}