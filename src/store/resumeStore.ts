import type Resume from "@/interfaces/Resume";
import { create } from "zustand";

interface ResumeState {
    savedResumes: Resume[],
    isLoading: boolean,

    setIsLoading: (status: boolean) => void,
    setResumes: (resumes: Resume[]) => void,
    addResume: (resume: Resume) => void,
    removeResume: (resume: Resume) => void,
}

export const useResumeStore = create<ResumeState>((set) => ({
    savedResumes: [],
    isLoading: true,

    setIsLoading: (status: boolean) => {
        set(() => ({ isLoading: status }))
    },
    setResumes: (resumes: Resume[]) => {
        set(() => ({ savedResumes: [...resumes] }))
    },
    addResume: (resume: Resume) => {
        set((state) => ({ savedResumes: [...state.savedResumes, resume] }))
    },
    removeResume: (resume: Resume) => {
        set((state) => ({ savedResumes: state.savedResumes.filter((res) => res.id !== resume.id) }))
    }
}))