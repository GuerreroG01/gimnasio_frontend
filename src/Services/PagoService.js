import axiosInstance from './AxiosInstance';

const API_URL = "/Pagos";

const getPagosByMonthAndYear = (year, month, day) =>
  axiosInstance.get(`${API_URL}/${year}/${month}/${day}`).then(r => r.data);

const getAñosConPagos = () =>
  axiosInstance.get(`${API_URL}/resumen-pagos/años`).then(r => r.data);

const getMesesConPagos = (year) =>
  axiosInstance.get(`${API_URL}/resumen-pagos/${year}/meses`).then(r => r.data);

const getDiasConPagos = (year, month) =>
  axiosInstance.get(`${API_URL}/resumen-pagos/${year}/${month}/dias`).then(r => r.data);

const getPagoById = (id) =>
  axiosInstance.get(`${API_URL}/${id}`).then(r => r.data);

const createPago = (pagoData) =>
  axiosInstance.post(API_URL, pagoData).then(r => r.data);

const updatePago = (id, pagoData) =>
  axiosInstance.put(`${API_URL}/${id}`, pagoData).then(r => r.data);

const deletePago = (id) =>
  axiosInstance.delete(`${API_URL}/${id}`).then(r => r.data);

const updateFecha = (fechaData) =>
  axiosInstance.put(`${API_URL}/EditFechas_Cliente`, fechaData).then(r => r.data);

const deleteFecha = (fechaData) =>
  axiosInstance.delete(`${API_URL}/DeleteFechas_Cliente`, { data: fechaData }).then(r => r.data);

const getUltimoPagoVigente = (clienteId, esEdicion = false) =>
  axiosInstance
    .get(`${API_URL}/ultimo-pago-vigente`, { params: { clienteId, esEdicion } })
    .then(r => r.data)
    .catch(error => {
      if (error.response?.status === 404) return { diasRestantes: 0 };
      throw error;
    });

const getTiempoPagoCliente = (codigoPago) => //Cambiado
  axiosInstance
    .get(`${API_URL}/GetFechas_Cliente`, { params: { codigoPago } })
    .then(r => r.data)
    .catch(error => {
      if (error.response?.status === 404)
        return { fechaVencimiento: 'Sin Registro para este pago' };
      throw error;
    });

const checkFechaClienteExist = (codigoPago) => //Cambiado
  axiosInstance
    .get(`${API_URL}/CheckPagoExist/${codigoPago}`)
    .then(r => r.data.exists);

const getUltimoPagoPorCliente = (usuarioId) =>
  axiosInstance.get(`${API_URL}/ultimo-pago-cliente/${usuarioId}`).then(r => r.data);

const getVencimientosProximos = () =>
  axiosInstance.get(`${API_URL}/vencimientos-proximos`).then(r => r.data);

const PagoService = {
  getPagosByMonthAndYear,
  getAñosConPagos,
  getMesesConPagos,
  getDiasConPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
  updateFecha,
  deleteFecha,
  getUltimoPagoVigente,
  getTiempoPagoCliente,
  checkFechaClienteExist,
  getUltimoPagoPorCliente,
  getVencimientosProximos,
};
export default PagoService;