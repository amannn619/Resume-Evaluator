import { useState, useMemo } from "react";
import Button from "./Button";

export interface ColumnDef<T> {
    key: string;
    header: string;
    accessor: (row: T) => React.ReactNode;
    sortable?: boolean;
    sortFn?: (a: T, b: T) => number;
}

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    pagination?: boolean;
    pageSize?: number;
    keyExtractor: (row: T) => string | number;
}

export default function Table<T>({
    data,
    columns,
    pagination = false,
    pageSize = 10,
    keyExtractor
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        const column = columns.find((c) => c.key === sortConfig.key);
        if (!column) return data;

        return [...data].sort((a, b) => {
            const defaultSort = () => {
                const aVal = column.accessor(a);
                const bVal = column.accessor(b);
                if (typeof aVal === "string" && typeof bVal === "string") {
                    return aVal.localeCompare(bVal);
                }
                if (typeof aVal === "number" && typeof bVal === "number") {
                    return aVal - bVal;
                }
                return 0;
            };

            const result = column.sortFn ? column.sortFn(a, b) : defaultSort();
            return sortConfig.direction === "asc" ? result : -result;
        });
    }, [data, columns, sortConfig]);

    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, pagination, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = (key: string) => {
        setSortConfig((prev) => {
            if (prev?.key === key) {
                return prev.direction === "asc" ? { key, direction: "desc" } : null;
            }
            return { key, direction: "asc" };
        });
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <div className="hidden md:block w-full overflow-x-auto bg-surface border border-outline rounded-xl shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-background border-b border-outline">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-3 font-semibold text-main ${col.sortable ? 'cursor-pointer select-none hover:bg-hover transition-colors' : ''}`}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && (
                                            <span className="text-subtle text-xs">
                                                {sortConfig?.key === col.key
                                                    ? (sortConfig.direction === "asc" ? "▲" : "▼")
                                                    : "↕"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline">
                        {paginatedData.map((row) => (
                            <tr key={keyExtractor(row)} className="hover:bg-background/50 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-main">
                                        {col.accessor(row)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden flex flex-col gap-4">
                {paginatedData.map((row) => (
                    <div key={keyExtractor(row)} className="bg-surface border border-outline rounded-xl p-4 shadow-sm flex flex-col gap-3">
                        {columns.map((col) => (
                            <div key={col.key} className="flex justify-between items-start gap-4">
                                <span className="text-xs font-semibold text-subtle uppercase tracking-wider mt-0.5">
                                    {col.header}
                                </span>
                                <div className="text-sm text-main text-right">
                                    {col.accessor(row)}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {pagination && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 px-2">
                    <p className="text-sm text-subtle">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}