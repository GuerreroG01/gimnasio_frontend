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
  return axiosInstance.get(`${API_URL}/BuscarClientes`, {
    params: { nombres, apellidos },
  });
};
const actualizarNivelCliente = (clienteId) => {
  if (!clienteId) throw new Error("Debe especificar el ID del cliente");

  return axiosInstance.post(`${API_URL}/next-level`, null, {params: { clienteId }}
  ).then(res => res.data);
};


const ClienteService = {
  getClientePorLetra,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClientePorPrimeraLetra,
  buscarCliente,
  actualizarNivelCliente
};
export default ClienteService;