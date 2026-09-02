import { VITE_PYTHON_API_URL } from '../config/env';

const sendChatMessage = async (message: string) => {
    const response = await fetch(`${VITE_PYTHON_API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data;
};

export { sendChatMessage };