// app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoginForm from './components/LoginForm';
import { authenticate, authenticateThirdParty } from "./loginActions";

export default function Login() {
  const handleLoginWithGitHub = () => authenticateThirdParty("github");
  const handleLoginWithGoogle = () => authenticateThirdParty("google");

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h1>Login</h1>
      <div className="p-4 border border-gray-300 rounded-md">

        <LoginForm />

        <hr className="my-6" />
        <button
          onClick={handleLoginWithGitHub}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Login with GitHub
        </button>
        <hr className="my-2" />

        <button
          onClick={handleLoginWithGoogle}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >Login with Google</button>
      </div>
    </div>
  );
};


