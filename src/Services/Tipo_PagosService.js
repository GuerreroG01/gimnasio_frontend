import axios from 'axios';

const API_URL = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL) + "/Tipo_Pagos";

const getAuthHeader = () => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

const getTipoPagos = async () => {
    try {
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de pagos:', error);
        throw error;
    }
};

const getTipoPagoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el tipo de pago con ID ${id}:`, error);
        throw error;
    }
};

const createTipoPago = async (tipoPago) => {
    try {
        const response = await axios.post(API_URL, tipoPago, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        return response.data;
    } catch (error) {
        console.error('Error al crear el tipo de pago:', error);
        throw error;
    }
};

const updateTipoPago = async (id, tipoPago) => {
    try {
        await axios.put(`${API_URL}/${id}`, tipoPago, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
    } catch (error) {
        console.error(`Error al actualizar el tipo de pago con ID ${id}:`, error);
        throw error;
    }
};

const deleteTipoPago = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    } catch (error) {
        console.error(`Error al eliminar el tipo de pago con ID ${id}:`, error);
        throw error;
    }
};

const tipo_PagosService = {
    getTipoPagos,
    getTipoPagoById,
    createTipoPago,
    updateTipoPago,
    deleteTipoPago
};

export default tipo_PagosService;
