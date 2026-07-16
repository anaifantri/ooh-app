import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL, // Set your Laravel API base URL
    withCredentials: true, // Required for sending the CSRF cookie
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
