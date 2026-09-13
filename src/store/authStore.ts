import { create } from "zustand";

interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null,
    accessToken: string | null,
    setAuth: (user: User, token: string) => void,
    clearAuth: () => void,
}

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    accessToken: null,

    setAuth: (user: User, token) => {
        set({ user: user, accessToken: token })
    },
    clearAuth: () => set({ user: null, accessToken: null })
}));