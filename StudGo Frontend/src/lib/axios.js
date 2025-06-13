import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const BaseUrl = "https://studgo.runasp.net";
export const ChatBaseUrl = "http://localhost:10000";

export const axiosInstance = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');
    
    return axios.create({
        // Use a relative URL that will be proxied
        baseURL: "https://studgo.runasp.net/api",
        // Removing withCredentials for this API as it's causing CORS issues
        // withCredentials: true,
        headers: token ? { 
            'Authorization': token,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        },
    });
};

export const chatAxiosInstance = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');
    
    return axios.create({
        baseURL: ChatBaseUrl,
        headers: token ? { 
            'Authorization': token,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        },
    });
};

export const getSAIdFromToken = () => {
    const token = localStorage.getItem('accessToken').replace('bearer ', '');
    if (!token) return null;
    
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken?.EntityId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
