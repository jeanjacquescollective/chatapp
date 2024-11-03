'use client';
import React, { useState, useRef, useEffect } from 'react';
import { socket } from '@/socket';
import { io } from 'socket.io-client';
import { Message } from '@/types/Message';
import { createChatMessage } from './actions';


interface ChatProps {
    messages: Message[];
    userId: string;
    chatroomId: string;
}




const Chat: React.FC<ChatProps> = ({ messages, userId, chatroomId }) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState('');
    const [newMessages, setNewMessages] = useState<Message[]>(messages);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [newMessages]);


    const sendMessage = async() => {
        const message = {
            content: newMessage,
            userId,
            chatroomId: chatroomId
        }
        await createChatMessage(message); // Save the message to the database
        socket.emit('chat message', message); // Broadcast the message
        setNewMessage('');
    };
    useEffect(() => {
        socket.emit('join room', chatroomId);
        socket.on('chat message', ({ content, userId: receivedUserId }) => {
            setNewMessages((prevMessages) => [...prevMessages, { userId: receivedUserId, content: content, user: { id: receivedUserId, username: '' } }]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);


    return (
        <div>
            <div className="h-64 overflow-y-auto mb-4">
                {newMessages.length === 0 && (
                    <div className="text-center text-gray-500">
                        Start the conversation
                    </div>
                )}
                {newMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded mb-2 ${message.user?.id === userId ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}
                    >
                        {message.user?.id !== userId && (
                            <div className="text-xs text-gray-500 mb-1">
                                {message.user?.id || 'Unknown'}
                            </div>
                        )}
                        {message.content}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
