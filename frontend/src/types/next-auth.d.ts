// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      strapiToken: unknown;
      id: number;
      name?: string | null;
      email?: string | null;
      role: "user" | "admin";
      uid: string;
    };
  }

  interface User {
    id: number;
    name?: string | null;
    email?: string | null;
    role: "user" | "admin";
    uid: string;
  }
}
