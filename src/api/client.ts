import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

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

