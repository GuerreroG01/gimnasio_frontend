import axiosInstance from './AxiosInstance';

const API_URL = "/Cliente";

const getClientePorLetra = (letra) => {
  return axiosInstance.get(API_URL, {
    params: { letra },
  }).then(res => res.data);
};

const getClienteById = (id) => {
  return axiosInstance.get(`${API_URL}/${id}`);
};

const createCliente = (clienteData) => {
  return axiosInstance.post(API_URL, clienteData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateCliente = (id, formData) => {
  return axiosInstance.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteCliente = (id) => {
  return axiosInstance.delete(`${API_URL}/${id}`);
};

const getClientePorPrimeraLetra = () => {
  return axiosInstance.get(`${API_URL}/PrimeraLetraCliente`);
};

const buscarCliente = (nombres, apellidos) => {
  return axiosInstance.get(`${API_URL}/BuscarCliente`, {
    params: { nombres, apellidos },
  });
};

export default {
  getClientePorLetra,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClientePorPrimeraLetra,
  buscarCliente,
};