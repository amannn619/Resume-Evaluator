import { create } from "zustand";

interface AuthState {
    user: { name: string, email: string } | null,
    accessToken: string | null,
    loginMock: () => void,
    logout: () => void,
}

export const useAuthStore = create<AuthState>((set) => ({

    user: null,
    accessToken: null,
    loginMock: () => {
        set({
            user: { name: "Aman Yadav", email: "aman@gamil.com" },
            accessToken: "mock-jwt-token-123"
        })
    },
    logout: () => {
        set({
            user: null,
            accessToken: null
        })
    }
}));