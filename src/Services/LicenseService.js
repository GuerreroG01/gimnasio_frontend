import axiosInstance from './AxiosInstance';
import Logger from './Logger';

const API_URL = '/license';

const getActiveLicense = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/get_license_active`);
    return response.data;
  } catch (error) {
    Logger.error('Error al obtener la licencia activa', error);
    throw error;
  }
};

const activateLicense = async (licenseKey) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/activate`, {
      licenseKey: licenseKey
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 423) {
        throw new Error(error.response.data.message);
      }

      throw new Error(error.response.data.message);
    }

    Logger.error('Error al activar la licencia', error);
    throw error;
  }
};
const getActiveOrLastLicense = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/get_active_or_last_license`);
    return response.data;
  } catch (error) {
    Logger.error('Error al obtener la licencia activa', error);
    throw error;
  }
};

const licenseService = {
  getActiveLicense,
  activateLicense,
  getActiveOrLastLicense
};

export default licenseService;