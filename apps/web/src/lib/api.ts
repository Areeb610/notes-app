import axios from "axios";

const API = axios.create({
  baseURL: "https://notes-app-rs15.onrender.com",
});

export const setAuthToken = (token: string) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default API;
