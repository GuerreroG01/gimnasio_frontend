import axios from 'axios';
import AuthService from './AuthService';

const BASE_PATH  = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL);

const axiosInstance = axios.create({
  baseURL: BASE_PATH,
});

// Interceptor para agregar el token a cada request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const rutasPermitidas = ['/login', '/progresos'];

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401 && !rutasPermitidas.includes(window.location.pathname)) {
      console.log('Sesión expirada o token inválido, cerrando sesión...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;