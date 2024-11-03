import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket = io();

        // Listen for messages from the server
        socket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        socket.emit("message", message); // Send message to server
        setMessages((prev) => [...prev, message]); // Add your message to the chat
        setMessage(""); // Clear input field
    };

    return (
        <div>
            <h1>Real-Time Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
