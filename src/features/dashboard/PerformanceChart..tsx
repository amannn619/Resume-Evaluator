import { useDashboardStore } from "@/store/dashboardStore";
import { memo, useMemo, useState } from "react";
import { Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PerformanceChart = memo(function PerformanceChart() {
    const evaluations = useDashboardStore(state => state.evaluations);

    const [hoveredLine, setHoveredLine] = useState<string | null>(null);
    const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});
    const [selectedRole, setSelectedRole] = useState("All");

    const uniqueRoles = useMemo(() => {
        const roles = new Set(evaluations.map(e => e.jobTitle));
        return ["All", ...Array.from(roles)];
    }, [evaluations]);

    const chartData = useMemo(() => {
        if (!evaluations || evaluations.length === 0) return [];
        const filtered = selectedRole === "All" ? evaluations : evaluations.filter(e => e.jobTitle === selectedRole);
        const sortedEvals = [...filtered].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        console.log('r')
        return sortedEvals.map(evaluation => {
            const dateObj = new Date(evaluation.createdAt);
            const dateLabel = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            const fullTime = dateObj.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
            });

            return {
                timestamp: dateObj.getTime(),
                dateLabel: dateLabel,
                fullTime: fullTime,

                [evaluation.resume.fileName]: evaluation.score
            };
        });
    }, [evaluations, selectedRole]);

    const uniqueResumeNames = useMemo(() => {
        const names = new Set(evaluations.map(e => e.resume.fileName));
        return Array.from(names).slice(0, 5);
    }, [evaluations]);

    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
    const handleLegendClick = (dataKey: string) => {
        setHiddenLines(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey]
        }));
    };



    return (
        <div className="w-full h-[400px] bg-surface p-5 border border-outline rounded-xl shadow-sm flex flex-col animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-main">Historical Performance</h3>
                    <p className="text-sm text-subtle mt-0.5">Track how your resumes scores over time</p>
                </div>

                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-background border border-outline text-main text-sm rounded-lg focus:ring-brand focus:border-brand block p-2.5 outline-none cursor-pointer max-w-[200px] truncate"
                >
                    {uniqueRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--outline)" vertical={false} />

                        <XAxis
                            dataKey="fullTime"
                            stroke="var(--text-subtle)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="var(--text-subtle)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-hover)', borderColor: 'var(--border-focus)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: 500 }}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullTime || label}
                        />

                        <Legend
                            onClick={(e) => handleLegendClick(e.dataKey as string)}
                            onMouseEnter={(e) => setHoveredLine(e.dataKey as string)}
                            onMouseLeave={() => setHoveredLine(null)}
                            position="top"
                            wrapperStyle={{ cursor: 'pointer', paddingBottom: '10px' }}
                        />

                        {uniqueResumeNames.map((resumeName, index) => (
                            <Line
                                key={resumeName}
                                type="monotone"
                                dataKey={resumeName}
                                stroke={colors[index % colors.length]}
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                connectNulls={true}
                                hide={hiddenLines[resumeName]}
                                strokeOpacity={hoveredLine && hoveredLine !== resumeName ? 0.2 : 1}
                                onMouseEnter={() => setHoveredLine(resumeName)}
                                onMouseLeave={() => setHoveredLine(null)}
                            />
                        ))}

                        <Brush
                            dataKey="dateLabel"
                            height={30}
                            stroke="var(--text-subtle)" /* Uses your Tailwind brand color for the slider handles */
                            fill="var(--bg-surface)" /* Blends into your app background */
                            tickFormatter={() => ''} /* Hides the extra text inside the brush to keep it clean */
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
})

export default PerformanceChart;