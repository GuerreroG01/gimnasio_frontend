import axiosInstance from './AxiosInstance';
import Logger from './Logger';

const getDatosResumen = async () => {
    try {
        const response = await axiosInstance.get('/DashBoard');
        return response.data;
    } catch (error) {
        Logger.error('Error al obtener los mensajes', error);
        throw error;
    }
};

const ConsolidadoService = {
    getDatosResumen
};
export default ConsolidadoService;