// ConsolidadoService.js

import axios from 'axios';

const API_URL = (window._env_ ? window._env_.REACT_APP_API_URL : process.env.REACT_APP_API_URL) + "/DashBoard";

const getAuthHeader = () => {
    const authToken = localStorage.getItem('authToken');
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

const getDatosResumen = async () => {
    try {
      debugger
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error('Error al obtener los mensajes', error);
        throw error;
    }
};

/*
const ConsolidadoService2 = {
  getDatosResumen: async () => {
    // Simula un retardo para representar una llamada real
    await new Promise(resolve => setTimeout(resolve, 500));

    // Datos dummy similares a la imagen
    return {
      usuarios: 5,
      usuariosDiff: 0, // % respecto al mes anterior
      ingresos: 0.00,
      ingresosDiff: 0, // % respecto a ayer
      ventas: 5,
      ventasDiff: 0, // % respecto a la semana pasada
      asistencias: 0,
      asistenciasDiff: -3 // % respecto a ayer
    };
  }
};
*/

const ConsolidadoService = {
    getDatosResumen
};

export default ConsolidadoService;
