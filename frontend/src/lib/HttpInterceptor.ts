import axios from "axios"
export const env = import.meta.env

const HttpInterceptor = axios.create({
    baseURL:env.VITE_SERVER_URL,
    withCredentials:true
})

export default HttpInterceptor