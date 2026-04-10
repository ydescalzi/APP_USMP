import axios from 'axios';

const api = axios.create({
  // ¡Cambiamos Ngrok por tu URL permanente de Railway!
  baseURL: 'https://appusmp-production.up.railway.app', 
  timeout: 15000,
});

export default api;
