import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logoIcon from "../../assets/logo.svg";
import { authApi } from "@/api/client.js";

export default function AppLayout() {
    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === "dark";
        }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await authApi.reload();
                setAuth(response.data.user, response.data.accessToken)
            }
            catch (err) {
                clearAuth();
            }
        }
        restoreSession();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark])

    async function handleLogout() {
        await authApi.logout()
        clearAuth()
    }


    return (
        <div className="min-h-screen bg-background">
            <nav className="fixed bottom-0 md:bottom-auto md:top-0 left-0 right-0 z-50 bg-surface border-t md:border-t-0 md:border-b border-outline px-4 md:px-8 py-2 flex justify-between items-center shadow-sm md:shadow-none">
                <div className="flex items-center gap-4">
                    <NavLink
                        to="/"
                        className="text-xl font-extrabold text-brand tracking-tight">
                        <img
                            src={logoIcon}
                            alt="Evaluate.AI Logo"
                            className="w-8 h-8 transform group-hover:scale-105 transition-transform duration-200"
                        />
                    </NavLink>

                    {
                        user && (
                            <span className="text-sm font-medium text-main">
                                {user.username || "User"}
                            </span>
                        )

                    }

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 bg-subtle ${isDark ? '' : ' border border-outline'
                            }`}
                        aria-label="Toggle Theme"
                    >
                        <div
                            className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 bg-main ${isDark ? '  translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                <div>
                    {user ? (
                        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <button onClick={handleLogout} className="text-xs text-error font-semibold hover:underline">
                                Logout
                            </button>

                            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                {user.username?.charAt(0).toUpperCase() || "U"}
                            </div>

                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <NavLink
                                to="/register"
                                className="px-4 py-2 font-medium bg-btn-primary-bg text-btn-primary-text rounded-lg hover:opacity-90 transition-opacity">
                                Register
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="px-4 py-2 font-medium bg-btn-secondary-bg text-btn-secondary-text border border-outline rounded-lg hover:bg-outline/20 transition-colors">
                                Login
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav >
            <main className="pb-24 pt-8 md:pt-24 md:pb-8 max-w-5xl mx-auto px-4">
                <Outlet />
            </main>
        </div >
    );
}
