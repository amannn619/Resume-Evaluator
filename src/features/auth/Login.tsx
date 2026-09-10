import { authApi } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const response = await authApi.login({ username, password });
            setAuth(response.data.user, response.data.accessToken);
            navigate('/')
        }
        catch (err) {
            console.log(err.response)
            setError(err.response.data.message)
        }
        finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-surface border border-outline rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-main mb-6">Login</h2>
            {error && <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-bold text-main mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-outline rounded-lg bg-background text-main focus:ring-2 focus:ring-brand focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-main mb-1">Password</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-outline rounded-lg bg-background text-main focus:ring-2 focus:ring-brand focus:outline-none"
                        required
                    />
                </div>
                <button className="mt-4 bg-brand text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 disabled:opacity-50"
                    type="submit"
                    disabled={!username || !password || isLoading}>
                    {isLoading ? "Logging in" : "Login"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-subtle">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand font-semibold hover:underline transition-all">
                    Register here
                </Link>
            </div>
        </div>
    )
}