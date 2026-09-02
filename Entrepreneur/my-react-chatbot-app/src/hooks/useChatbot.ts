import { useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chatbot';

const useChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (message) => {
        setMessages((prevMessages) => [...prevMessages, { role: 'user', content: message }]);
        setLoading(true);

        try {
            const response = await sendChatMessage(message);
            setMessages((prevMessages) => [...prevMessages, { role: 'bot', content: response }]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        messages,
        loading,
        sendMessage,
    };
};

export default useChatbot;