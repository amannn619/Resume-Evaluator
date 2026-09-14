import { authApi } from "@/api/client";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await authApi.login({ userName, password });
            setAuth(response.data.user, response.data.accessToken);
            navigate('/')
        }
        catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to authenticate."
            );
            console.error("Login Error", err);
        }
        finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-surface border border-outline rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-main mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-bold text-main mb-1">Username</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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

                <Button type="submit" disabled={!userName || !password || isLoading}>
                    {isLoading ? "Logging in" : "Login"}
                </Button>
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