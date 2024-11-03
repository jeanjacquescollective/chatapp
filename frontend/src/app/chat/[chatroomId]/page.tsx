import Chat from './components/chat';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from "next-auth/next"
import { gql, request } from 'graphql-request';
import { fetchMessages } from './actions';
import { Message } from '@/types/Message';

// pages/index.js



interface PageProps {
    params: {
        chatroomId: string;
    };
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const STRAPI_GRAPHQL_URL = process.env.STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '';


const Page = async ({ params }: PageProps) => {
    const session = await getServerSession(authOptions);
    const { chatroomId } = await params;
    
    const strapiToken = session?.user.strapiToken as string;
    const messages = (await fetchMessages(chatroomId, strapiToken) || []).map((message: any) => ({
        ...message,
        userId: message.user.id,
    }));
    const userId = session?.user.uid as unknown as string;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-4">Real-Time Chat</h1>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
                <Chat messages={messages} userId={userId} chatroomId={chatroomId}/>
            </div>
        </div>
    );
};

export default Page;