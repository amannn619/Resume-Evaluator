import { create } from "zustand";

interface Resume {
    id: string,
    userId: string,
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
        set(() => ({ savedResumes: [...resumes] }))
    },
    addResume: (resume: Resume) => {
        set((state) => ({ savedResumes: [...state.savedResumes, resume] }))
    },
    removeResume: (resume: Resume) => {
        set((state) => ({ savedResumes: state.savedResumes.filter((res) => res.id !== resume.id) }))
    }
}))