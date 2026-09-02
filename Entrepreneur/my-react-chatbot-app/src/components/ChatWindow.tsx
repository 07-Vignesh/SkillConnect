import React, { useState, useEffect } from 'react';
import { sendChatMessage } from '../services/chatbot';
import ChatMessage from './ChatMessage';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.trim()) {
            const userMessage = { role: 'user', content: input };
            setMessages((prev) => [...prev, userMessage]);
            setInput('');

            const response = await sendChatMessage(input);
            if (response) {
                const botMessage = { role: 'bot', content: response };
                setMessages((prev) => [...prev, botMessage]);
            }
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [input]);

    return (
        <div className="chat-window">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} role={msg.role} content={msg.content} />
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatWindow;