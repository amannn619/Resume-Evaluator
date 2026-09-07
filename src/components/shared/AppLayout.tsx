import { useAuthStore } from "@/store/authStore";
import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
    const getNavClass = (isActive: boolean, isSecondary = false) => {
        const baseClasses = "hover:text-brand font-semibold transition-colors";

        if (isSecondary) {
            return `${baseClasses} ${isActive ? 'text-main font-bold' : 'text-subtle'}`;
        }
        return `${baseClasses} ${isActive ? 'text-brand' : 'text-main'}`;
    };

    const user = useAuthStore((state) => state.user);
    const loginMock = useAuthStore((state) => state.loginMock);
    const logout = useAuthStore((state) => state.logout);

    return (
        <>
            <nav className="flex gap-6 p-4 bg-surface border-b border-outline">
                <NavLink to="/" className={({ isActive }) => getNavClass(isActive)}>Home</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => getNavClass(isActive)}>Dashboard</NavLink>
                {
                    user ? (
                        <>
                            <button onClick={logout} className="text-error font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                                Logout
                            </button>
                            <span className="text-subtle text-sm">Welcome, {user.name}</span>
                        </>

                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => getNavClass(isActive)}>Login</NavLink>
                            <NavLink to="/register" className={({ isActive }) => getNavClass(isActive)}>Register</NavLink>
                            <button onClick={loginMock} className="text-success font-semibold hover:opacity-80 transition-opacity cursor-pointer">
                                Mock Login
                            </button>
                        </>
                    )
                }

            </nav>

            <main className="p-8 max-w-5xl mx-auto">
                <Outlet />
            </main>
        </>
    )
}