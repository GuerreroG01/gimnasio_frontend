import axiosInstance from "./AxiosInstance";
const API_URL = '/TipoCambio';

const getTipoCambios = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de cambio:', error);
        throw error;
    }
};
const getTipoCambioById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el tipo de cambio con ID ${id}:`, error);
        throw error;
    }
};
const createTipoCambio = async (tipoCambio) => {
    console.log('Creando tipo de cambio:', tipoCambio);
    try {
        const response = await axiosInstance.post(API_URL, tipoCambio);
        return response.data;
    } catch (error) {
        console.error('Error al crear el tipo de cambio:', error);
        throw error;
    }
};
const updateTipoPago = async (id, tipoCambio) => {
    try {
        await axiosInstance.put(`${API_URL}/${id}`, tipoCambio);
    } catch (error) {
        console.error(`Error al actualizar el tipo de cambio con ID ${id}:`, error);
        throw error;
    }
};
const deleteTipoCambio = async (id) => {
    try {
        await axiosInstance.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error al eliminar el tipo de cambio con ID ${id}:`, error);
        throw error;
    }
};
const TipoCambioService = {
    getTipoCambios,
    getTipoCambioById,
    createTipoCambio,
    updateTipoPago,
    deleteTipoCambio,
};
export default TipoCambioService;