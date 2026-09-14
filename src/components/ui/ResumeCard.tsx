import type Resume from "@/interfaces/Resume";
import Tooltip from "@/components/ui/ToolTip"
interface ResumeCardProps {
    resume: Resume;
    onDownload?: (resume: Resume) => void;
    onUpdate?: (resume: Resume) => void;
    onDelete?: (resume: Resume) => void;
}
export default function ResumeCard({ resume, onDownload, onUpdate, onDelete }: ResumeCardProps) {

    const formattedDate = new Date(resume.updatedAt).toLocaleDateString('en-US', {
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
                    <Tooltip content={resume.fileName}>
                        <h3 className="text-sm font-semibold text-main truncate cursor-default">
                            {resume.fileName}
                        </h3>
                    </Tooltip>
                    <p className="text-xs text-subtle mt-0.5">
                        Updated on {formattedDate}
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
                    onClick={() => onUpdate?.(resume)}
                    className="p-2 text-subtle hover:text-brand hover:bg-brand/10 rounded-md transition-colors"
                    title="Replace Resume"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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