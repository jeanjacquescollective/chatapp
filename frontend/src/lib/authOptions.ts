import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
import { cookies } from 'next/headers';

type StrapiErrorT = {
  error: {
    message: string;
  };
};

type StrapiLoginResponseT = {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
    blocked: boolean;
    role: string;
    documentId?: string;
  };
};

export const authOptions: NextAuthOptions = {
  // added
  //  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  providers: [
    // Credentials Provider for Email and Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        const strapiResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials!.identifier,
              password: credentials!.password,
            }),
          }
        );
        const data = await strapiResponse.json();
        if (strapiResponse.ok) {
          return {
            name: data.user.username,
            email: data.user.email,
            id: data.user.id.toString(),
            // strapiUserId: data.user.id,
            blocked: data.user.blocked,
            strapiToken: data.jwt,
            role: data.user.role, // Ensure role is included
          };
        }
        return null;
      },
    }),
    // GitHub Provider for OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }: { token: any, user?: any, account?: any }) {
      console.log("jwt callback");
      console.log("token", token);
      // Persist the GitHub ID to the token right after sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // to copy the whole user object to the token
        // token = { ...token, ...user }
      }
      if (account) {
        if (account.provider === "google" || account.provider === "github") {
          try {
            const strapiResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
              { cache: 'no-cache' }
            );
            if (!strapiResponse.ok) {
              const strapiError: StrapiErrorT = await strapiResponse.json();
              throw new Error(strapiError.error.message);
            }
            const strapiLoginResponse: StrapiLoginResponseT =
              await strapiResponse.json();
              // console.log("strapiLoginResponse", strapiLoginResponse);
            token.strapiToken = strapiLoginResponse.jwt;
            // get the documentId from the user object
            token.uid = strapiLoginResponse.user.documentId;
          } catch (error) {
            throw error;
          }
        } 1

      }
      console.log("token", token);
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token && session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as "admin" | "user";
        session.user.strapiToken = token.strapiToken;
        session.user.uid = token.uid;
        delete session.user.email; // sanitize data for security
      }
      // to copy the the whole token to the session
      // session.user = {
      //   ...session.user,
      //   ...token
      // }
      return session;
    },
  },

};
