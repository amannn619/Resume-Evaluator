import type Evaluation from "@/interfaces/Evaluation";
import { create } from "zustand";

interface DashboardState {
    evaluations: Evaluation[],
    hasFetched: boolean;
    setHasFetched: (value: boolean) => void,
    setEvaluations: (evaluations: Evaluation[]) => void,
    addEvaluation: (evaluation: Evaluation) => void,
    removeEvaluation: (evaluation: Evaluation) => void,
}

export const useDashboardStore = create<DashboardState>((set) => ({
    evaluations: [],
    hasFetched: false,
    setHasFetched: (value: boolean) => {
        set(() => ({ hasFetched: value }))
    },
    setEvaluations: (evaluations: Evaluation[]) => {
        set(() => ({ evaluations: evaluations }))
    },
    addEvaluation: (evaluation: Evaluation) => {
        set((state) => ({ evaluations: [...state.evaluations, evaluation] }))
    },
    removeEvaluation: (evaluation: Evaluation) => {
        set((state) => ({ evaluations: state.evaluations.filter((rec) => rec.id !== evaluation.id) }))
    }
}))
