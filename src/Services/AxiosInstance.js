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

// Interceptor para refrescar token en respuesta 401
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await AuthService.refreshToken();
      if (newToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        console.log('Token refrescado, reintentando la solicitud original');
        return axiosInstance(originalRequest);
      } else {
        console.log('Algo falló al refrescar el token');
        AuthService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;