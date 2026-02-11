import axiosInstance from './AxiosInstance';

const API_URL = '/ClienteProgreso';


const getProgresoById = async (id) => {
    if (!id) throw new Error('Debe especificar el ID del progreso');
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener progreso con ID ${id}`, error.response?.data || error);
        throw error;
    }
};

const getProgresosByCliente = async (clienteId) => {
    if (!clienteId) throw new Error('Debe especificar el ID del cliente');
    try {
        const response = await axiosInstance.get(`${API_URL}/cliente/${clienteId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error al obtener progresos del cliente ${clienteId}`,
            error.response?.data || error
        );
        throw error;
    }
};

const getProgresosByPrograma = async (programaFitId) => {
    if (!programaFitId) throw new Error('Debe especificar el ID del programa');
    try {
        const response = await axiosInstance.get(`${API_URL}/programa/${programaFitId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error al obtener progresos del programa ${programaFitId}`,
            error.response?.data || error
        );
        throw error;
    }
};

//Para incrementar los dias en el nivel en el modelo cliente.
const incrementDiasEnNivel = async (clienteId) => {
    if (!clienteId) throw new Error('Debe especificar el ID del cliente');
    try {
        const response = await axiosInstance.post(
            `${API_URL}/${clienteId}/increment-nivel`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error al incrementar días en nivel para el cliente ${clienteId}`,
            error.response?.data || error
        );
        throw error;
    }
};
//Para incrementar los dias en un programa
const incrementDiaPrograma = async (clienteId) => {
    if (!clienteId) throw new Error('Debe especificar el ID del cliente');
    try {
        const response = await axiosInstance.post(
            `${API_URL}/${clienteId}/increment-dia`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error al incrementar día de programa para el cliente ${clienteId}`,
            error.response?.data || error
        );
        throw error;
    }
};


const ClienteProgresoService = {
    getProgresoById,
    getProgresosByCliente,
    getProgresosByPrograma,
    incrementDiasEnNivel,
    incrementDiaPrograma
};

export default ClienteProgresoService;