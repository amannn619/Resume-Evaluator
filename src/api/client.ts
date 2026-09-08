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
        const response = await apiClient.post('/evaluate', formData);
        console.log(response.data)
        return response.data;
    },

    mockEvaluate: async (formData: FormData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.9) {
                    reject("Network Error");
                }
                else {
                    resolve({
                        score: 85,
                        suggestions: ['Add more keywords', 'Fix typo in experience']
                    })
                }
            }, 1000)
        })
    }
}

