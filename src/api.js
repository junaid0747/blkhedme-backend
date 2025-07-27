// src/api.js
import axios from 'axios';

export const BASE_URL = 'https://apiv2.blkhedme.com/api/';
// export const BASE_URL = 'http://127.0.0.1:8000/api/';


const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
