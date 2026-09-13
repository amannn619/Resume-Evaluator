import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logoIcon from "../../assets/logo.svg";
import { authApi } from "@/api/client.js";
import Button from "../ui/Button";
import PageLoader from "../ui/PageLoader";
import { Toaster } from "react-hot-toast";

export default function AppLayout() {
    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
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

    const [initStatus, setInitStatus] = useState<'checking' | 'fading' | 'done'>('checking');

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await authApi.reload();
                setAuth(response.data.user, response.data.accessToken)
            }
            catch (err) {
                clearAuth();
            }
            finally {
                setInitStatus("fading");

                setTimeout(() => {
                    setInitStatus('done');
                }, 500);
            }
        }
        restoreSession();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: { background: '#333', color: '#fff' }
                }}
            />
            {initStatus !== 'done' && (
                <PageLoader isFading={initStatus === 'fading'} />
            )}

            {initStatus !== 'checking' && (
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
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
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
                            {user ? (
                                <div className="flex items-center gap-4 md:gap-6 relative" ref={menuRef}>
                                    <span className="text-sm font-medium text-main hidden sm:block">
                                        {user.username || "User"}
                                    </span>
                                    <Button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        size='sm'
                                        className="rounded-full ring-2 ring-transparent hover:ring-outline-focus transition-all"
                                    >
                                        {user.username?.charAt(0).toUpperCase() || "U"}
                                    </Button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 bottom-full mb-3 md:bottom-auto md:top-full md:mt-3 w-56 bg-surface border border-outline rounded-xl shadow-lg flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">

                                            {/* Header */}
                                            <div className="px-4 py-3 border-b border-outline">
                                                <p className="text-sm font-medium text-main truncate">{user.username}</p>
                                            </div>

                                            {/* Links */}
                                            <div className="py-1">
                                                <NavLink to="/resumes" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-main hover:bg-background hover:text-brand transition-colors">
                                                    Resumes
                                                </NavLink>
                                                {/* <NavLink to="/settings" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-main hover:bg-background hover:text-brand transition-colors">
                                                Account Settings
                                            </NavLink> */}
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-outline py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button size="sm" variant="outline">
                                        <NavLink to="/register">Register</NavLink>
                                    </Button>
                                    <Button size="sm">
                                        <NavLink to="/login">Login</NavLink>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </nav >
                    <main className="pb-24 pt-8 md:pt-18 md:pb-8 max-w-5xl px-4">
                        <Outlet />
                    </main>
                </div >
            )}
        </>
    );
}
