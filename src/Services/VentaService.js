import axiosInstance from './AxiosInstance';

const API_URL = '/Venta';

const GetAniosConVentas = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/anios`);
    console.log('Años con ventas obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener años con ventas', error.response?.data || error);
    throw error;
  }
};

const GetMesesConVentas = async (anio) => {
  if (!anio) throw new Error('Debe especificar un año');

  try {
    console.log(`Obteniendo meses con ventas para el año ${anio}`);
    const response = await axiosInstance.get(`${API_URL}/meses/${anio}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener meses con ventas para el año ${anio}`, error.response?.data || error);
    throw error;
  }
};

const GetDiasConVentas = async (anio, mes) => {
  if (!anio || !mes) throw new Error('Debe especificar año y mes');

  try {
    const response = await axiosInstance.get(`${API_URL}/dias/${mes}/${anio}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener días con ventas para ${anio}-${mes}`, error.response?.data || error);
    throw error;
  }
};

const GetVentasPorFecha = async (fechaInicio, fechaFin = null) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/${fechaInicio}`,
      {
        params: fechaFin ? { fechaFin } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener las ventas:',
      error.response?.data || error.message
    );
    throw error;
  }
};

const PostVenta = async (venta) => {
  try {
    const response = await axiosInstance.post(API_URL, venta);
    return response.data;
  } catch (error) {
    console.error('Error al crear la venta', error.response?.data || error);
    throw error;
  }
};

const PutVenta = async (id, venta) => {
  if (!id) {
    console.error('El ID de la venta es indefinido');
    return;
  }

  try {
    const response = await axiosInstance.put(
      `${API_URL}/${id}`,
      venta
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la venta', error.response?.data || error);
    throw error;
  }
};

const DeleteVenta = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la venta', error.response?.data || error);
    throw error;
  }
};

const GetVentaById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/detalle/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la venta', error.response?.data || error);
    throw error;
  }
};

const VentaService = {
  GetAniosConVentas,
  GetMesesConVentas,
  GetDiasConVentas,
  GetVentasPorFecha,
  PostVenta,
  PutVenta,
  DeleteVenta,
  GetVentaById,
};
export default VentaService;
