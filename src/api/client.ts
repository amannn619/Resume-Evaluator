import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const authApi = {
    register: async (userData: any) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data
    },
    login: async (credentials: any) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data
    },
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data
    }

}

export const resumeApi = {
    evaluate: async (formData: FormData) => {
        const response = await apiClient.post('/resume/evaluateResume', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return response.data;
    },
}

