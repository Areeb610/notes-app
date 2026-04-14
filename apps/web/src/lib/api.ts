import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

export const setAuthToken = (token: string) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default API;
