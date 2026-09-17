import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import logoIcon from "../../assets/logo.svg";
import { authApi, resumeApi } from "@/api/client.js";
import Button from "../ui/Button";
import PageLoader from "../ui/PageLoader";
import toast, { Toaster } from "react-hot-toast";
import { useResumeStore } from "@/store/resumeStore";
import { useDashboardStore } from "@/store/dashboardStore";

export default function AppLayout() {
    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const setEvaluations = useDashboardStore((state) => state.setEvaluations);
    const setHasFetched = useDashboardStore((state) => state.setHasFetched);


    const setResume = useResumeStore(state => state.setResumes);
    const setResumeLoading = useResumeStore(state => state.setIsLoading);

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
        setResumeLoading(true);
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
        if (initStatus !== 'done') return;
        setIsMenuOpen(false);
        if (user) {
            const fetchResumes = async () => {
                try {
                    const response = await resumeApi.getAll();
                    setResume(response.data);
                } catch (err: any) {
                    toast.error(
                        err.response?.data?.message ||
                        "Failed to fetch resumes."
                    );
                    console.error("Failed to fetch resumes after login", err);
                } finally {
                    setResumeLoading(false);
                }
            };
            fetchResumes();
        } else {
            setResume([]);
            setResumeLoading(false);
        }
    }, [user, initStatus, setResume, setResumeLoading]);

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
        await authApi.logout();
        setHasFetched(false);
        setEvaluations([]);
        clearAuth();
    }

    const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
        `transition-colors duration-200 text-sm font-medium ${isActive ? "text-brand border-b-2 border-brand py-1" : "text-subtle hover:text-main py-1"
        }`;

    const mobileIconClass = ({ isActive }: { isActive: boolean }) =>
        `p-2 rounded-xl transition-all duration-200 ${isActive ? "bg-brand/10 text-brand" : "text-subtle hover:bg-surface hover:text-main"
        }`;

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
                        <div className="flex w-full items-center gap-4">
                            <NavLink
                                to="/"
                                className="text-xl font-extrabold text-brand tracking-tight">
                                <img
                                    src={logoIcon}
                                    alt="Evaluate.AI Logo"
                                    className="w-8 h-8 transform group-hover:scale-105 transition-transform duration-200"
                                />
                            </NavLink>

                            <div className="hidden md:flex items-center gap-6 mt-1">
                                <NavLink to="/" className={desktopLinkClass} end>
                                    Home
                                </NavLink>
                                {user && (
                                    <>
                                        <NavLink to="/resumes" className={desktopLinkClass}>
                                            Resumes
                                        </NavLink>
                                        <NavLink to="/dashboard" className={desktopLinkClass}>
                                            Dashboard
                                        </NavLink>
                                    </>
                                )}
                            </div>

                            <div className="flex w-full md:hidden items-center gap-4 justify-center">
                                <NavLink to="/" className={mobileIconClass} end aria-label="Home">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </NavLink>
                                {user && (
                                    <>
                                        <NavLink to="/resumes" className={mobileIconClass} aria-label="Resumes">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </NavLink>
                                        <NavLink to="/dashboard" className={mobileIconClass} aria-label="Dashboard">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            {user ? (
                                <div className="flex items-center gap-4 md:gap-6 relative" ref={menuRef}>
                                    <span className="text-sm font-medium text-main hidden sm:block">
                                        {user.userName || "User"}
                                    </span>
                                    <Button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        size='sm'
                                        className="rounded-full ring-2 ring-transparent hover:ring-outline-focus transition-all"
                                    >
                                        {user.userName?.charAt(0).toUpperCase() || "U"}
                                    </Button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 bottom-full mb-3 md:bottom-auto md:top-full md:mt-3 w-56 bg-surface border border-outline rounded-xl shadow-lg flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100">

                                            <div className="px-4 py-3 border-b border-outline">
                                                <p className="text-sm font-medium text-main truncate">{user.userName}</p>
                                            </div>

                                            {/* <div className="py-1">
                                                <NavLink to="/settings" onClick={() => setIsMenuOpen(false)} className="block text-sm text-main hover:bg-background hover:text-brand transition-colors">

                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-medium"
                                                    >
                                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Account Settings
                                                    </button>
                                                </NavLink>
                                            </div> */}

                                            <div className="border-t border-outline py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-medium text-error hover:bg-error/10 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
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

                    <main className="mx-auto pb-24 pt-8 md:pt-18 md:pb-8 max-w-5xl px-4">
                        <Outlet />
                    </main>

                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 p-3 bg-surface border border-outline rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:border-brand/50 transition-all duration-300 text-main focus:outline-none focus:ring-2 focus:ring-brand"
                        aria-label="Toggle Theme"
                    >
                        <div className="relative w-6 h-6 overflow-hidden">
                            <svg
                                className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${isDark ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
                                    }`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>

                            <svg
                                className={`absolute inset-0 w-6 h-6 transition-all duration-500 transform ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
                                    }`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </div>
                    </button>
                </div >
            )}
        </>
    );
}
