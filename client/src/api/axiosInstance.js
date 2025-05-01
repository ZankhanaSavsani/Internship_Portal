import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASEURL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;