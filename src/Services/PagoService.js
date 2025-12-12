import axios from 'axios';

const API_URL = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL) + "/Pagos";

// Obtener el Bearer authToken desde el almacenamiento local o donde lo tengas
const getAuthHeader = () => {
  
  const authToken = localStorage.getItem('authToken'); // o como lo tengas almacenado
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

const getPagosByMonthAndYear = async (year, month, day) => {
    try {
        
        const response = await axios.get(`${API_URL}/${year}/${month}/${day}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pagos por mes y año:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const getAñosConPagos = async () => {
    try {
        const response = await axios.get(`${API_URL}/resumen-pagos/años`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los años con pagos:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const getMesesConPagos = async (year) => {
    try {
        const response = await axios.get(`${API_URL}/resumen-pagos/${year}/meses`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los meses con pagos:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const getDiasConPagos = async (year, month) => {
    try {
        const response = await axios.get(`${API_URL}/resumen-pagos/${year}/${month}/dias`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los días con pagos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const getPagoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el pago', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createPago = async (pagoData) => {
    try {
        const response = await axios.post(API_URL, pagoData, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        console.log('Pago creado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creando pago:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const updatePago = async (id, pagoData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, pagoData, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            }
        });
        console.log('Pago actualizado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error actualizando pago:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const deletePago = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        console.log('Pago eliminado:', id);
    } catch (error) {
        console.error('Error eliminando pago:', error);
        throw error;
    }
};
const getUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/pago_usuario`, {
          headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
};

const getUsuarioByCodigo = async (codigoUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/pago_usuario/${codigoUsuario}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};
const updateFecha = (fechaData) => {
    return axios.put(`${API_URL}/EditFechas_Usuario`, fechaData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
    });
};
const deleteFecha = async (fechaData) => {
    try {
        const response = await axios.delete(`${API_URL}/DeleteFechas_Usuario`, {
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            data: fechaData
        });
        console.log('Fecha de usuario eliminada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error eliminando fecha de usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
};
const getUltimoPagoVigente = async (usuarioId, esEdicion = false) => {
    try {
        const response = await axios.get(`${API_URL}/ultimo-pago-vigente?usuarioId=${usuarioId}&esEdicion=${esEdicion}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el último pago vigente:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 404) {
            return { diasRestantes: 0 };
        }
        throw error;
    }
};
const getFechasUsuario = async (usuarioId, fechaPago) => {
    try {
      const response = await axios.get(`${API_URL}/GetFechas_Usuario?usuarioId=${usuarioId}&fechaPago=${fechaPago}`, {
          headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la fecha de vencimiento:', error.response ? error.response.data : error.message);
      if (error.response && error.response.status === 404) {
        return { fechaVencimiento: 'Sin Registro para este pago' };
      }
      throw error;
    }
};  
const checkFechaUsuarioExist = async (usuarioId, fechaPago) => {
    try {
      const url = `${API_URL}/CheckFechaUsuarioExist/${usuarioId}/${fechaPago}`;
      const response = await axios.get(url, {
          headers: getAuthHeader()
      });
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar la existencia de la fecha de usuario:", error);
      throw error;
    }
};
const getUltimoPagoPorUsuario = async (usuarioId) => {
    try {
        const response = await axios.get(`${API_URL}/ultimo-pago-usuario/${usuarioId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el último pago por usuario:', error.response ? error.response.data : error.message);
        throw error;
    }
}
const getVencimientosProximos = async () => {
    try {
        const response = await axios.get(`${API_URL}/vencimientos-proximos`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los vencimientos próximos:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const PagoService = {
    getPagosByMonthAndYear,
    getAñosConPagos,
    getMesesConPagos,
    getDiasConPagos,
    getPagoById,
    createPago,
    updatePago,
    deletePago,
    getUsuarios,
    getUsuarioByCodigo,
    updateFecha,
    deleteFecha,
    getUltimoPagoVigente,
    getFechasUsuario,
    checkFechaUsuarioExist,
    getUltimoPagoPorUsuario,
    getVencimientosProximos
};
export default PagoService;