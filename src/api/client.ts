import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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
        console.log(error.response)
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
    evaluate: async (formData: FormData) => {
        const response = await apiClient.post('/resume/evaluateResume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    saveResume: async (formData: FormData) => {
        const response = await apiClient.post('resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get('/resume');
        return response.data
    }
}

