
import React, { useEffect, useRef } from 'react';
import type { ChatMessage, UIMappings } from '../types';

interface MessageProps {
    message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.from === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl mb-2.5 ${isUser ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-900' : 'bg-gray-100 text-gray-800'}`}>
                <div className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                <div className="text-xs text-gray-500 mt-1.5">
                    {isUser ? 'Farmer' : 'AgriBot'}
                    {message.source && <span className="font-bold text-green-700"> | Source: {message.source}</span>}
                </div>
            </div>
        </div>
    );
};


interface ChatPanelProps {
    T: UIMappings;
    status: string;
    conversation: ChatMessage[];
    userInput: string;
    onUserInput: (value: string) => void;
    onSend: () => void;
    onSpeakLast: () => void;
    isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ T, status, conversation, userInput, onUserInput, onSend, onSpeakLast, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [conversation]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            onSend();
        }
    };
    
    return (
        <div className="bg-white/50 p-4 rounded-xl shadow-sm flex flex-col h-[650px] lg:h-auto">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                <strong className="text-lg text-gray-800">{T.conv}</strong>
                <small className="text-sm text-gray-600">{status}</small>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
                {conversation.map((msg, index) => (
                    <Message key={index} message={msg} />
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <footer className="flex gap-2 pt-3 border-t border-gray-200">
                <input
                    type="text"
                    placeholder={T.placeholder}
                    value={userInput}
                    onChange={(e) => onUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow disabled:bg-gray-100"
                />
                <button
                    onClick={onSend}
                    disabled={isLoading || !userInput.trim()}
                    className="px-4 py-2.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {T.send}
                </button>
                <button
                    onClick={onSpeakLast}
                    disabled={isLoading}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {T.play}
                </button>
            </footer>
        </div>
    );
};
