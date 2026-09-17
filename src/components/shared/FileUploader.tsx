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
        <div className="p-6 border-2 border-dashed border-outline rounded-lg bg-surface text-main">
            <label className="block mb-2 font-bold">
                Upload Resume
            </label>
            <input
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="block w-full text-sm text-subtle file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-white hover:file:opacity-90 cursor-pointer transition-colors" />

            {error && <p className="text-error mt-2 text-sm">{error}</p>}
        </div>
    )
}