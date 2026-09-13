import { useRef, type ChangeEvent, useEffect } from "react";
import { useState } from "react";

interface FileUploaderInputProps {
    onFileSelect: (file: File | null) => void,
    currentFile?: File | null,
    accept?: string;
    maxSizeMB?: number;
}

export default function FileUploader({ accept = '.pdf', onFileSelect, maxSizeMB = 1, currentFile }: FileUploaderInputProps) {
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentFile === null && inputRef.current) {
            inputRef.current.value = "";
        }
    }, [currentFile]);

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
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-inverse hover:file:opacity-90 cursor-pointer transition-colors" />

            {error && <p className="text-error mt-2 text-sm">{error}</p>}
        </div>
    )
}