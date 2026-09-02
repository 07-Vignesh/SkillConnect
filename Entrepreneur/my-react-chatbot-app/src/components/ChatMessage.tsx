import React from 'react';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
    return (
        <div className={`chat-message ${role}`}>
            <span className="chat-role">{role === 'user' ? 'You' : 'Bot'}:</span>
            <span className="chat-content">{content}</span>
        </div>
    );
};

export default ChatMessage;