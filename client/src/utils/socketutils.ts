import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    // transports: ["websocket"], // Ise abhi comment karein testing ke liye
    withCredentials: true,
    autoConnect: true
});

export default socket