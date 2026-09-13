import { create } from "zustand";

export interface Resume {
    id: number,
    userId: number,
    fileName: string
    createdAt: string;
}

interface ResumeState {
    savedResumes: Resume[],
    setResumes: (resumes: Resume[]) => void,
    addResume: (resume: Resume) => void,
    removeResume: (resume: Resume) => void,
}

export const useResumeStore = create<ResumeState>((set) => ({
    savedResumes: [],
    setResumes: (resumes: Resume[]) => {
        console.log(resumes)
        set(() => ({ savedResumes: [...resumes] }))
    },
    addResume: (resume: Resume) => {
        set((state) => ({ savedResumes: [...state.savedResumes, resume] }))
    },
    removeResume: (resume: Resume) => {
        set((state) => ({ savedResumes: state.savedResumes.filter((res) => res.id !== resume.id) }))
    }
}))