import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://api.welltrack.local", // puerto servidor
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // si se necesita enviar cookies/session
});

export default axiosInstance;
