import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Замените на URL вашего бэкенда, если он отличается
});

export default api;
