import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (cb: () => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = () => {
    refreshSubscribers.map(cb => cb());
    refreshSubscribers = [];
};

apiClient.interceptors.request.use(
    (config) => {
        if ((config as any)._requireAuth !== false) {
            const token = useAuthStore.getState().accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.data instanceof Blob &&
            error.response.data.type === 'application/json'
        ) {
            const text = await error.response.data.text();
            error.response.data = JSON.parse(text);
        }

        if (error.response.status == 401 && error.response.data.message == "TOKEN_EXPIRED") {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await authApi.refresh();
                    const user = useAuthStore.getState().user;
                    useAuthStore.getState().setAuth(user, response.data.accessToken);
                    isRefreshing = false;
                    onRefreshed()
                    return apiClient(originalRequest);
                }
                catch (err) {
                    isRefreshing = false;
                    refreshSubscribers = [];
                    window.location.href = '/login';
                    useAuthStore.getState().clearAuth();
                    return Promise.reject(err)
                }
            }
            else {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(apiClient(originalRequest))
                    })
                })
            }
        }
        // let errorMessage = error.response.data.message || "Our servers are experiencing issues. Please try again later.";
        // toast.error(errorMessage);
        return Promise.reject(error)
    }
)

export const authApi = {
    reload: async () => {
        const response = await apiClient.get('/auth/me', { _requireAuth: false } as any);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await apiClient.post('/auth/register', userData, { _requireAuth: false } as any);
        return response.data
    },
    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials, { _requireAuth: false } as any);
        return response.data
    },
    logout: async () => {
        const response = await apiClient.get('/auth/logout', { _requireAuth: false } as any);
        return response.data
    },
    refresh: async () => {
        const response = await apiClient.get("/auth/refresh", { _requireAuth: false } as any);
        return response.data
    }

}

export const resumeApi = {
    getAll: async () => {
        const response = await apiClient.get('/resume');
        return response.data
    },
    saveResume: async (formData: FormData) => {
        const response = await apiClient.post('resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    download: async (id: number) => {
        const response = await apiClient.get(`/resume/download/${id}`);
        return response.data;
    },
    get: async (id: number) => {
        const response = await apiClient.get(`/resume/${id}`);
        return response.data
    },
    delete: async (id: number) => {
        const response = await apiClient.delete(`/resume/${id}`);
        return response.data;
    },
    evaluate: async (formData: FormData) => {
        const response = await apiClient.post('/resume/evaluateResume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    evaluateSaved: async (id: number, description: string) => {
        const response = await apiClient.post(`/resume/evaluateSavedResume/${id}`, { description });
        return response.data;
    },
}

