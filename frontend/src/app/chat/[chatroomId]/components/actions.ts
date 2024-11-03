"use server";

import { revalidatePath } from 'next/cache';
import { Chatroom } from '@/types/Chatroom';
import { gql, request } from 'graphql-request';
import { Message } from '@/types/Message';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

const CREATE_CHATMESSAGE = gql`
    mutation CreateChatmessage($data: ChatmessageInput!) {
        createChatmessage(data: $data) {
            createdAt
            content
            chatroom {
                documentId
            }
            users_permissions_user {
                username
                documentId
            }
        }
    }
`;



export const createChatMessage = async ({ content, chatroomId, userId }: { content: string, chatroomId: string, userId: string }) => {
    console.log('createChatMessage', content, chatroomId, userId);
    if (content.trim() === '') return;
    const headers = {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    };
    try {
        const response = await request<{ createChatmessage: { message: Message } }>(
            STRAPI_GRAPHQL_URL,
            CREATE_CHATMESSAGE,
            { data: { content, chatroom: chatroomId, users_permissions_user: userId } },
            headers
        );
        if (response.createChatmessage) {
            console.log('response.createChatmessage', response.createChatmessage);
            return response.createChatmessage.message;
        }
    } catch (error) {
        console.error('Error creating message:', error);
    }
    // revalidatePath(`/chat/${chatroomId}`);
};