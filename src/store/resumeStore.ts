import { create } from "zustand";

interface Resume{
    id: string,
    title: string,
    score: number;
}

interface ResumeState{
    savedResumes: Resume[],
    addResume: (resume: Resume) => void,
}

export const useResumeStore = create<ResumeState>((set) => ({
    savedResumes: [],
    addResume: (resume: Resume) => {
        set((state) => ({ savedResumes: [...state.savedResumes, resume]}))
    }
}))