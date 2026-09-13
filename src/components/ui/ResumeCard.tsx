import type { Resume } from "@/store/resumeStore";

interface ResumeCardProps {
    resume: Resume;
    onDownload?: (resume: Resume) => void;
    onDelete?: (resume: Resume) => void;
}
export default function ResumeCard({ resume, onDownload, onDelete }: ResumeCardProps) {

    const formattedDate = new Date(resume.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    return (
        <div className="bg-surface border border-outline rounded-xl p-4 flex items-center justify-between hover:border-brand transition-colors group">

            <div className="flex items-center gap-4 overflow-hidden">
                <div className="p-3 bg-background rounded-lg text-brand shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>

                <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-semibold text-main truncate">
                        {resume.fileName}
                    </h3>
                    <p className="text-xs text-subtle mt-0.5">
                        Added on {formattedDate}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">

                <button
                    onClick={() => onDownload?.(resume)}
                    className="p-2 text-subtle hover:text-main hover:bg-background rounded-md transition-colors"
                    title="Download"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>

                <button
                    onClick={() => onDelete?.(resume)}
                    className="p-2 text-subtle hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                    title="Delete"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

            </div>
        </div>
    )
}