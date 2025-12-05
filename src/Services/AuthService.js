import axios from 'axios';

const API_URL = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL) + "/Auth/login"; 

const PostLogin = async (loginData) => {
    try {
        const response = await axios.post(API_URL, loginData);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error en la respuesta:', error.response.data);
        } else if (error.request) {
            console.error('No hubo respuesta del servidor', error.request);
        } else {
            console.error('Error al realizar la solicitud', error.message);
        }
        throw error;
    }
};
const LoginService = {
    PostLogin
};
export default LoginService;