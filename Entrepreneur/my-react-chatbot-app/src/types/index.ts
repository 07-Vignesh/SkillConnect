export interface ChatMessage {
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

export interface ChatState {
    messages: ChatMessage[];
    isLoading: boolean;
}

export interface SendMessageResponse {
    message: ChatMessage;
}