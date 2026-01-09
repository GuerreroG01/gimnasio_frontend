import axiosInstance from './AxiosInstance';

const API_URL = '/Mensaje';

const getMensajesSistema = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/emisor/sistema-crossfit`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensajes del sistema', error);
    throw error;
  }
};

const getMensajesOtros = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/emisor/otros`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener mensajes de otros emisores', error);
    throw error;
  }
};

const createMensaje = async (mensaje) => {
  console.log('Lo que se esta enviando:',mensaje);
  try {
    const response = await axiosInstance.post(
      API_URL,
      mensaje
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear el mensaje', error);
    throw error;
  }
};

const updateMensaje = async (id, mensaje) => {
  try {
    await axiosInstance.put(
      `${API_URL}/${id}`,
      mensaje
    );
  } catch (error) {
    console.error('Error al actualizar el mensaje', error);
    throw error;
  }
};

const deleteMensaje = async (id) => {
  try {
    await axiosInstance.delete(
      `${API_URL}/${id}`
    );
  } catch (error) {
    console.error('Error al eliminar el mensaje', error);
    throw error;
  }
};

const getNoLeidosMensajes = async () => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/no-leidos`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de mensajes', error);
    throw error;
  }
};

const marcarMensajesLeidos = async (ids) => {
  if (!ids || ids.length === 0) return;
  console.log('Ids enviados:',ids);

  try {
    await axiosInstance.put(
      `${API_URL}/marcar-leidos`,
      ids
    );
  } catch (error) {
    console.error('Error al marcar mensajes como leídos', error);
    throw error;
  }
};
const getIdsNoLeidosSistema = async () => {
  const mensajes = await getMensajesSistema();
  console.log('Mensajes del sistema:', mensajes);

  return mensajes
    .filter(m => m.leido === false)
    .map(m => m.codigo);
};

const getIdsNoLeidosUsuarios = async () => {
  const mensajes = await getMensajesOtros();
  console.log('Mensajes del usuario:', mensajes);

  return mensajes
    .filter(m => m.leido === false)
    .map(m => m.codigo);
};

const mensajeService = {
  getMensajesSistema,
  getMensajesOtros,
  createMensaje,
  updateMensaje,
  deleteMensaje,
  getNoLeidosMensajes,
  marcarMensajesLeidos,
  getIdsNoLeidosSistema,
  getIdsNoLeidosUsuarios
};
export default mensajeService;