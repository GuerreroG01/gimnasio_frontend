import axiosInstance from './AxiosInstance';

const API_URL = "/TiempoPago";

const getFechasByClienteId = (clienteId) => {
  return axiosInstance.get(`${API_URL}`, {
    params: { clienteId },
  });
};

const getFechaById = (id) => {
  return axiosInstance.get(`${API_URL}/${id}`);
};

const createFecha = (fechaData) => {
  return axiosInstance.post(API_URL, fechaData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const TiempoPagoService = {
  getFechasByClienteId,
  getFechaById,
  createFecha
};

export default TiempoPagoService;