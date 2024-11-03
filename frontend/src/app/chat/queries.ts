import { gql } from 'graphql-request';
export const GET_CHATROOMS = gql`
    query Chatrooms {
  chatrooms {
  documentId  
  createdAt
    documentId
    title
    creatorId {
      documentId
      username
    }
  }
}
`;

export const ADD_CHATROOM = gql`
mutation CreateChatroom($data: ChatroomInput!) {
    createChatroom(data: $data) {
        documentId
        title
        creatorId {
            username
            documentId
        }
    }
}
`;

export const DELETE_CHATROOM = gql`
mutation Mutation($documentId: ID!) {
  deleteChatroom(documentId: $documentId) {
    documentId
  }
}
`;