import axiosInstance from './AxiosInstance';

const API_URL = '/Tipo_Pagos';

const getTipoPagos = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tipos de pagos:', error);
    throw error;
  }
};

const getTipoPagoById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el tipo de pago con ID ${id}:`, error);
    throw error;
  }
};

const createTipoPago = async (tipoPago) => {
  try {
    const response = await axiosInstance.post(API_URL, tipoPago);
    return response.data;
  } catch (error) {
    console.error('Error al crear el tipo de pago:', error);
    throw error;
  }
};

const updateTipoPago = async (id, tipoPago) => {
  try {
    await axiosInstance.put(`${API_URL}/${id}`, tipoPago);
  } catch (error) {
    console.error(`Error al actualizar el tipo de pago con ID ${id}:`, error);
    throw error;
  }
};

const deleteTipoPago = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el tipo de pago con ID ${id}:`, error);
    throw error;
  }
};
const searchTipoPagoByName = (descripcion) => {
  return axiosInstance.get(`${API_URL}/buscarTiposPagos`, {
    params: { descripcion },
  });
}

const tipo_PagosService = {
  getTipoPagos,
  getTipoPagoById,
  createTipoPago,
  updateTipoPago,
  deleteTipoPago,
  searchTipoPagoByName,
};

export default tipo_PagosService;