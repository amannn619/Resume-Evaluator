import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '@/components/shared/AppLayout';
import Home from '@/features/home/Home';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';

const LazyDashboard = lazy(() => import('@features/dashboard/Dashboard'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/dashboard',
                element: (
                    <Suspense fallback={<div>Loading Dashboard...</div>}>
                        <LazyDashboard />
                    </Suspense>
                )
            }
        ]
    }
])