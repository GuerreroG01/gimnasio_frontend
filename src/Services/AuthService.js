import axios from 'axios';
import Logger from './Logger';

const API_URL = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL) + "/Auth/login"; 


const PostLogin = async (loginData) => {
    Logger.log('Lo que se esta enviando:',loginData);
    try {
        const response = await axios.post(API_URL, loginData);
        return response.data;
    } catch (error) {
        if (error.response) {
            Logger.error('Error en la respuesta:', error.response.data);
        } else if (error.request) {
            Logger.error('No hubo respuesta del servidor', error.request);
        } else {
            Logger.error('Error al realizar la solicitud', error.message);
        }
        throw error;
    }
};

const getToken = () => localStorage.getItem('token');
const isAuthenticated = () => !!getToken();

const LoginService = {
    PostLogin,
    getToken,
    isAuthenticated
};
export default LoginService;