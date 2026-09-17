import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
    const getNavClass = (isActive: boolean, isSecondary = false) => {
        const baseClasses = "hover:text-brand font-semibold transition-colors";

        if (isSecondary) {
            return `${baseClasses} ${isActive ? 'text-main font-bold' : 'text-subtle'}`;
        }
        return `${baseClasses} ${isActive ? 'text-brand' : 'text-main'}`;
    };
    return (
        <>
            <nav className="flex gap-6 p-4 bg-surface border-b border-outline">
                <NavLink to="/" className={({ isActive }) => getNavClass(isActive)}>Home</NavLink>
                <NavLink to="/dashboard" className={({ isActive }) => getNavClass(isActive)}>Dashboard</NavLink>
                <NavLink to="/login" className={({ isActive }) => getNavClass(isActive)}>Login</NavLink>
                <NavLink to="/register" className={({ isActive }) => getNavClass(isActive)}>Register</NavLink>
            </nav>

            <main className="p-8 max-w-5xl mx-auto">
                <Outlet />
            </main>
        </>
    )
}