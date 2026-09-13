import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/shared/AppLayout';
import Home from '@/features/home/Home';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Resumes from '@/features/resumes/Resumes';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import GuestRoute from '@/components/shared/GuestRoute';
import RouteErrorBoundary from '@/components/shared/RouteErrorBoundary';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                element: <GuestRoute />,
                children: [
                    {
                        path: '/login',
                        element: <Login />
                    },
                    {
                        path: '/register',
                        element: <Register />
                    },
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: '/resumes',
                        element: <Resumes />
                    }
                ]
            }
        ]
    }
])