import { evaluationApi } from "@/api/client"
import Result from "@/components/shared/Result";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { ColumnDef } from "@/components/ui/Table";
import Table from "@/components/ui/Table";
import type Evaluation from "@/interfaces/Evaluation";
import { useDashboardStore } from "@/store/dashboardStore"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast";
import PerformanceChart from "./PerformanceChart.";
import TopPerformer from "./TopPerformer";

export default function Dashboard() {
    const hasFetched = useDashboardStore(state => state.hasFetched);
    const evaluations = useDashboardStore(state => state.evaluations);
    const setEvaluations = useDashboardStore(state => state.setEvaluations);
    const setHasFetched = useDashboardStore((state) => state.setHasFetched);

    const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);

    useEffect(() => {
        if (!hasFetched) {
            const fetchData = async () => {
                try {
                    const response = await evaluationApi.getAll();
                    setEvaluations(response.data);
                    setHasFetched(true);
                }
                catch (err) {
                    toast.error(
                        err.response?.data?.message ||
                        "Failed to fetch Evaluations"
                    );
                    console.error("Failed to fetch Evaluations", err);
                }
            }
            fetchData()
        }
    }, [setEvaluations, setHasFetched])

    const columns: ColumnDef<Evaluation>[] = [
        {
            key: "jobTitle",
            header: "Role / Job Title",
            accessor: (row) => <span className="font-medium line-clamp-1">{row.jobTitle}</span>,
            sortable: true,
            sortFn: (a, b) => a.jobTitle.localeCompare(b.jobTitle)
        },
        {
            key: "fileName",
            header: "Resume",
            accessor: (row) => <span className="font-medium line-clamp-1">{row.resume.fileName}</span>,
            sortable: true,
            sortFn: (a, b) => a.resume.fileName.localeCompare(b.resume.fileName)
        },
        {
            key: "score",
            header: "Match Score",
            accessor: (row) => {
                const color = row.score >= 80 ? "text-green-500 bg-green-500/10"
                    : row.score >= 60 ? "text-yellow-600 bg-yellow-500/10"
                        : "text-red-500 bg-red-500/10";
                return (
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
                        {row.score}
                    </span>
                );
            },
            sortable: true,
            sortFn: (a, b) => a.score - b.score
        },
        {
            key: "date",
            header: "Evaluated On",
            accessor: (row) => new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            sortable: true,
            sortFn: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        },
        {
            key: "actions",
            header: "Actions",
            accessor: (row) => (
                <Button variant="secondary" size="sm" onClick={() => setSelectedEval(row)}>
                    View Result
                </Button>
            ),
            sortable: false
        }
    ];
    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in">


            {!hasFetched ? (
                <div className="h-64 bg-surface border border-outline rounded-xl animate-pulse" />
            ) : evaluations.length === 0 ? (
                <div className="text-center py-16 bg-surface border border-outline rounded-2xl border-dashed">
                    <h3 className="text-lg font-semibold text-main mb-2">No evaluations yet</h3>
                    <p className="text-subtle mb-6 max-w-sm mx-auto">
                        Head over to the Home page to evaluate your first resume against a job description.
                    </p>
                </div>
            ) : (
                <>
                    <PerformanceChart />
                    <TopPerformer />
                    <Table
                        data={evaluations}
                        columns={columns}
                        keyExtractor={(row) => row.id}
                        pagination={true}
                        pageSize={5}
                    />
                </>
            )}

            <Modal
                isOpen={!!selectedEval}
                onClose={() => setSelectedEval(null)}
                title={`Results: ${selectedEval?.jobTitle}`}
                size="xl"
            >
                {selectedEval && (
                    <Result aiResponse={selectedEval.aiResponse} />
                )}
            </Modal>
        </div>
    )
}