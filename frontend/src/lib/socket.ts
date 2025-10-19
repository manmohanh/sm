import { io } from "socket.io-client";
import { env } from "./HttpInterceptor";

const socket = io(env.VITE_SERVER_URL,{
    withCredentials:true
})

export default socket