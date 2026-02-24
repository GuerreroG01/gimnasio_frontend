import axiosInstance from './AxiosInstance';

const getDatosResumen = async () => {
    try {
        const response = await axiosInstance.get('/DashBoard');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los mensajes', error);
        throw error;
    }
};

const ConsolidadoService = {
    getDatosResumen
};
export default ConsolidadoService;