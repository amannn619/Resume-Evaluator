import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <>
            <nav style={{ padding: '1rem', background: '#eee', display: 'flex', gap: '1rem' }}>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>

            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>
        </>
    )
}