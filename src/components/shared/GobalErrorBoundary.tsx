import { Component, type ErrorInfo } from "react";
import Button from "../ui/Button";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}
export class GlobalErrorBoundary extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught Render Error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-main mb-2">Something went wrong</h1>
                    <p className="text-subtle mb-6 max-w-md">
                        We apologize, but a rendering error occurred in the application.
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                        Return to Home
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}