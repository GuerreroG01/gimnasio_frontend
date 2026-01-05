import axiosInstance from './AxiosInstance';

const API_URL = '/Asistencia';

const getAsistencias = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    console.log('Asistencias obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener las asistencias:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const postAsistencias = async (asistencias) => {
  try {
    console.log('Registrando asistencias:', asistencias);
    const response = await axiosInstance.post(API_URL, asistencias);
    return response.data;
  } catch (error) {
    console.error('Error al registrar la asistencia', error);
    throw error;
  }
};

const putAsistencias = async (id, asistencias) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${id}`, asistencias);
    return response.data;
  } catch (error) {
    console.error(
      'Error al actualizar la asistencia:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getAsistenciasPorFecha = async (primerafecha, segundafecha = null) => {
  try {
    let url = `${API_URL}/fecha/${primerafecha}`;
    if (segundafecha) {
      url += `?segundafecha=${segundafecha}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener asistencias por fecha:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const getAñosConAsistencia = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/resumen-asistencia/años`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos anuales de asistencias');
    throw error;
  }
};

const getMesesConAsistencia = async (year) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/resumen-asistencia/${year}/meses`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos mensuales de asistencias');
    throw error;
  }
};

const getDiasConAsistencia = async (year, month) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/resumen-asistencia/${year}/${month}/dias`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener los días con asistencias:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const AsistenciaService = {
  getAsistencias,
  postAsistencias,
  putAsistencias,
  getAsistenciasPorFecha,
  getAñosConAsistencia,
  getMesesConAsistencia,
  getDiasConAsistencia,
};

export default AsistenciaService;