// In-memory user store (for demonstration purposes)
export type User = {
    id: number;
    name: string;
    email: string;
    password: string | null; // Hashed password
    githubId: string | null;
    role: "user" | "admin";
  }