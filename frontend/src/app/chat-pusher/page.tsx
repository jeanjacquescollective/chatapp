import { useState, useEffect } from 'react';
import { gql, request } from 'graphql-request';
import AddRoom from './components/AddRoom';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/lib/authOptions';
import DeleteButton from './components/DeleteButton';
import {Chatroom} from '../../types/Chatroom';
import { GET_CHATROOMS, ADD_CHATROOM, DELETE_CHATROOM } from './queries';


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

async function fetchChatrooms() {
    const headers = {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    };
    const response = await request<{ chatrooms: Chatroom[] }>(STRAPI_GRAPHQL_URL, GET_CHATROOMS, {}, headers);
    return response.chatrooms;
}

const ChatPage = async () => {
    const chatrooms = await fetchChatrooms() || [];
    const session = await getServerSession(authOptions);
    console.log('session', session);



    const handleAddRoom = async (newRoomName: string) => {
        "use server";

        if (newRoomName.trim() === '') return;
        const headers = {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        };
        try {
            const response = await request<{ createChatroom: { chatroom:Chatroom} }>(
                STRAPI_GRAPHQL_URL,
                ADD_CHATROOM,
                { data: { creatorId: session?.user?.uid || null, title: newRoomName } },
                headers
            );
            chatrooms.push(response.createChatroom.chatroom);
        } catch (error) {
            console.error('Error adding chatroom:', error);
        }
        revalidatePath('/chat');
    };

    const handleDeleteRoom = async (documentId: string) => {
        "use server";
        const headers = {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        };
        try {
            await request(STRAPI_GRAPHQL_URL, DELETE_CHATROOM, { documentId }, headers);
            const index = chatrooms.findIndex((room: Chatroom) => room.documentId === documentId);
            chatrooms.splice(index, 1);
        } catch (error) {
            console.error('Error deleting chatroom:', error);
        }
        revalidatePath('/chat');
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>
            <div className="mb-4">
            <AddRoom handleAddRoom={handleAddRoom} />
            </div>
            <ul className="space-y-2">
            {chatrooms.map((room: Chatroom) => (
                <li key={room.documentId} className="p-2 bg-gray-100 rounded shadow flex justify-between items-center">
                <a href={`/chat-pusher/${room.documentId}`} className="text-blue-500 hover:underline">
                    {room.title}
                </a>
                {room.creatorId && room.creatorId.documentId === session?.user?.uid && (
                    <DeleteButton handleDeleteRoom={handleDeleteRoom} room={room}  />
                )}
                </li>
            ))}
            </ul>
        </div>
    );
};



export default ChatPage;
