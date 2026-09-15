import { useDashboardStore } from "@/store/dashboardStore";
import { useMemo } from "react";
import Table, { type ColumnDef } from "@/components/ui/Table";
import Tooltip from "@/components/ui/ToolTip"

interface RolePerformanceData {
    roleName: string;
    totalRoleEvals: number;
    bestResumeName: string;
    bestResumeEvalCount: number;
    averageScore: number;
}

export default function TopPerformers() {
    const evaluations = useDashboardStore(state => state.evaluations);

    const { overallBest, tableData } = useMemo(() => {
        if (!evaluations || evaluations.length === 0) {
            return { overallBest: null, tableData: [] };
        }
        const globalStats: Record<number, { sum: number; count: number; fileName: string }> = {};
        const roleStats: Record<string, Record<number, { sum: number; count: number; fileName: string }>> = {};
        const roleCounts: Record<string, number> = {};

        evaluations.forEach(ev => {
            const rId = ev.resume.id;
            const role = ev.jobTitle;
            const score = ev.score;

            if (!globalStats[rId]) globalStats[rId] = { sum: 0, count: 0, fileName: ev.resume.fileName };
            globalStats[rId].sum += score;
            globalStats[rId].count += 1;

            if (!roleStats[role]) roleStats[role] = {};
            if (!roleStats[role][rId]) roleStats[role][rId] = { sum: 0, count: 0, fileName: ev.resume.fileName };
            roleStats[role][rId].sum += score;
            roleStats[role][rId].count += 1;

            roleCounts[role] = (roleCounts[role] || 0) + 1;
        });

        let bestGlobalAvg = -1;
        let overallBestResult = null;

        for (const rId in globalStats) {
            const avg = globalStats[rId].sum / globalStats[rId].count;
            if (avg > bestGlobalAvg) {
                bestGlobalAvg = avg;
                overallBestResult = {
                    fileName: globalStats[rId].fileName,
                    score: Math.round(avg),
                    evalCount: globalStats[rId].count
                };
            }
        }

        const roleWinners: RolePerformanceData[] = [];
        for (const role in roleStats) {
            let bestRoleAvg = -1;
            let bestRoleResult = null;

            for (const rId in roleStats[role]) {
                const avg = roleStats[role][rId].sum / roleStats[role][rId].count;
                if (avg > bestRoleAvg) {
                    bestRoleAvg = avg;
                    bestRoleResult = {
                        fileName: roleStats[role][rId].fileName,
                        score: Math.round(avg),
                        count: roleStats[role][rId].count
                    };
                }
            }
            if (bestRoleResult) {
                roleWinners.push({
                    roleName: role,
                    totalRoleEvals: roleCounts[role],
                    bestResumeName: bestRoleResult.fileName,
                    bestResumeEvalCount: bestRoleResult.count,
                    averageScore: bestRoleResult.score
                });
            }
        }

        roleWinners.sort((a, b) => b.totalRoleEvals - a.totalRoleEvals);

        return {
            overallBest: overallBestResult,
            tableData: roleWinners
        };
    }, [evaluations]);

    if (!evaluations || evaluations.length === 0) return null;

    const columns: ColumnDef<RolePerformanceData>[] = [
        {
            key: "roleName",
            header: "Role",
            accessor: (row) => <span className="font-medium text-main">{row.roleName}</span>,
            sortable: true,
            sortFn: (a, b) => a.roleName.localeCompare(b.roleName)
        },
        {
            key: "totalRoleEvals",
            header: "Total Evals",
            accessor: (row) => <span className="text-subtle">{row.totalRoleEvals}</span>,
            sortable: true,
            sortFn: (a, b) => a.totalRoleEvals - b.totalRoleEvals
        },
        {
            key: "resumeName",
            header: "Resume",
            accessor: (row) => <span className="font-medium line-clamp-1">{row.bestResumeName}</span>,
            sortable: true,
            sortFn: (a, b) => a.bestResumeName.localeCompare(b.bestResumeName)
        },
        {
            key: "bestResumeEvalCount",
            header: "Resume Uses",
            accessor: (row) => <span className="text-subtle">{row.bestResumeEvalCount}</span>,
            sortable: true,
            sortFn: (a, b) => a.bestResumeEvalCount - b.bestResumeEvalCount
        },
        {
            key: "averageScore",
            header: "Avg Score",
            accessor: (row) => {
                const color = row.averageScore >= 80 ? "text-green-500 bg-green-500/10"
                    : row.averageScore >= 60 ? "text-yellow-600 bg-yellow-500/10"
                        : "text-red-500 bg-red-500/10";
                return (
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${color}`}>
                        {row.averageScore}
                    </span>
                );
            },
            sortable: true,
            sortFn: (a, b) => a.averageScore - b.averageScore
        }
    ];

    return (
        <div className="w-full  bg-surface border border-outline rounded-xl p-5 shadow-sm flex flex-col gap-5 mb-8 animate-in fade-in">

            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-main">Top Resumes by Role</h3>
                    <p className="text-sm text-subtle mt-1">Based on highest average score</p>
                </div>

                {overallBest && (
                    <div className="text-right bg-background border border-outline rounded-lg p-2.5 flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-bold text-subtle uppercase tracking-wider mb-0.5">Overall Best</span>
                        <div className="flex items-center gap-2">
                            <Tooltip content={overallBest.fileName}>
                                <span className="text-sm font-semibold text-main line-clamp-1 max-w-25" title={overallBest.fileName}>
                                    {overallBest.fileName}
                                </span>
                            </Tooltip>

                            <span className={`px-1.5 py-0.5 rounded text-sm font-bold ${overallBest.score >= 80 ? "text-green-500 bg-green-500/10" : overallBest.score >= 60 ? "text-yellow-600 bg-yellow-500/10" : "text-red-500 bg-red-500/10"}`}>
                                {overallBest.score}
                            </span>
                        </div>
                        <span className="text-xs text-subtle mt-0.5">{overallBest.evalCount} total uses</span>
                    </div>
                )}
            </div>

            <div className="-mx-2 sm:mx-0">
                <Table
                    data={tableData}
                    columns={columns}
                    keyExtractor={(row) => row.roleName}
                    pagination={tableData.length > 5}
                    pageSize={5}
                />
            </div>
        </div>
    );
}