import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL, // 👈 backend URL from .env
  withCredentials: true, // send cookies with requests
});

export default axiosInstance;
