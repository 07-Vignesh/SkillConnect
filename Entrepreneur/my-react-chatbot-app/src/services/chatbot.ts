import axios from 'axios';
import { VITE_PYTHON_API_URL, VITE_PYTHON_API_KEY } from '../config/env';

export const sendChatMessage = async (message: string) => {
    try {
        const response = await axios.post(VITE_PYTHON_API_URL, {
            message,
            apiKey: VITE_PYTHON_API_KEY,
        });

        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot API:', error);
        throw error;
    }
};