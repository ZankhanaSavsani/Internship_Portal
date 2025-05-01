import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASEURL,
  withCredentials: true, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({ message: 'Request timeout' });
    }
    return Promise.reject(error);
  }
);

export default instance;