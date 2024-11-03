"use client";
import { signOut } from 'next-auth/react';


export default function LogoutButton() {

    function handleSignOut() {
        // Remove the JWT token from the cookie
        
        document.cookie = 'next-auth.jwt-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        signOut();
    }
    return (
        <button
            onClick={handleSignOut}
            className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
            Logout
        </button>
    );
};

