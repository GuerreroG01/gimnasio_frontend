import axiosInstance from './AxiosInstance';
import Logger from './Logger';

const API_URL = "/ConfiguracionesSistema";

const getConfig = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            Logger.warn("No hay configuración del sistema.");
            return null;
        }
        Logger.error("Error al obtener la configuración del sistema", error);
        throw error;
    }
};

const updateConfig = async (config) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${config.id}`, config, {
            headers: { 'Content-Type': 'application/json' } // Authorization se maneja en el interceptor
        });
        return response.data;
    } catch (error) {
        Logger.error('Error al actualizar la configuración del sistema', error);
        throw error;
    }
};

const getinfoinactivos = async () => {
    try {
        const response = await axiosInstance.get(`${API_URL}/usuarios-inactivos`);
        return response.data;
    } catch (error) {
        Logger.error('Error al obtener información de inactivos', error);
        throw error;
    }
};
const getInactivosByIdMess = async (idMensaje) => {
    if (!idMensaje) return [];

    try {
        const response = await axiosInstance.get(
        `${API_URL}/usuarios-inactivos/mensaje/${idMensaje}`
        );

        return response.data;
    } catch (error) {
        Logger.error(
        'Error al obtener clientes inactivos por mensaje',
        error
        );
        throw error;
    }
};

const ConfigSistemService = {
    getConfig,
    updateConfig,
    getinfoinactivos,
    getInactivosByIdMess
};

export default ConfigSistemService;