import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '@/components/shared/AppLayout';
import Home from '@/features/home/Home';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Resumes from '@/features/resumes/Resumes';

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
                path: '/resumes',
                element: <Resumes />
            }
        ]
    }
])