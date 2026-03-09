const API_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || `Request failed with status ${response.status}`);
    }
    return response.json();
};

export const apiClient = {
    async createInterview(jobDescription: string, difficulty: string) {
        const response = await fetch(`${API_URL}/interviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription, difficulty }),
        });
        return handleResponse(response);
    },

    async getInterview(id: string) {
        const response = await fetch(`${API_URL}/interviews/${id}`);
        return handleResponse(response);
    },

    async evaluateAnswer(id: string, questionIndex: number, answer: string) {
        const response = await fetch(`${API_URL}/interviews/${id}/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionIndex, answer }),
        });
        return handleResponse(response);
    }
};
