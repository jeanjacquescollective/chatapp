"use server";

import { revalidatePath } from 'next/cache';
import { Chatroom } from '@/types/Chatroom';
import { gql, request } from 'graphql-request';
import { Message } from '@/types/Message';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';

type GraphQLMessage = {
    createdAt: string;
    content: string;
    documentId: string;
    users_permissions_user?: {
        userId: string;
        username: string;
        documentId: string;
    };
};

export const fetchMessages = async (roomId: string, token: string) => {
    const GET_MESSAGES = gql`
        query Chatmessages($filters: ChatmessageFiltersInput, $pagination: PaginationArg = { limit: -1 }) {
            chatmessages(filters: $filters, pagination: $pagination) {
                createdAt
                content
                documentId
                users_permissions_user {
                    userId
                    username
                    documentId
                }
            }
        }
    `;

    const variables = {
        "filters": {
            "chatroom": {
                "documentId": {
                    "eq": roomId
                }
            }
        }
    }

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const response: { chatmessages: GraphQLMessage[] } = await request(STRAPI_GRAPHQL_URL, GET_MESSAGES, variables, headers);
    console.log(response);
    const chatmessages = response.chatmessages.map((message) => {
        if (!message.users_permissions_user) {
            message.users_permissions_user = {
                userId: '',
                documentId: '',
                username: 'unknown'
            };
        }
        return {
            ...message,
            user: {
                id: message.users_permissions_user.documentId,
                username: message.users_permissions_user.username
            }
        }
    });
    return chatmessages;
};
