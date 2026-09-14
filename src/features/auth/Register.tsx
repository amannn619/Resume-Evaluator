import { authApi } from "@/api/client";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()
    const setAuth = useAuthStore((state) => state.setAuth);

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await authApi.register({
                username: username,
                password: password
            })

            setAuth(response.data.user, response.data.accessToken)
            navigate("/")
        }
        catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Unable to authenticate"
            );
            console.error("Register Error", err);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-surface border border-outline rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-main mb-6">Register</h2>
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

                <Button type="submit" disabled={!username || !password || isLoading}>
                    {isLoading ? "Creating User" : "Register"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-subtle">
                Don't have an account?{' '}
                <Link to="/login" className="text-brand font-semibold hover:underline transition-all">
                    Login here
                </Link>
            </div>
        </div>
    )
}