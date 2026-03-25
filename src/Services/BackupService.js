import axiosInstance from './AxiosInstance';
import Logger from './Logger';

const API_URL = "/Backup";

const getAllBackups = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        Logger.error("Error al obtener backups", error);
        throw error;
    }
};

const getBackupById = async (id) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            Logger.warn(`Backup con id ${id} no encontrado.`);
            return null;
        }
        Logger.error("Error al obtener backup por ID", error);
        throw error;
    }
};

const getBackupByTipo = async (tipo) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            Logger.warn(`Backup de tipo "${tipo}" no encontrado.`);
            return null;
        }
        Logger.error("Error al obtener backup por tipo", error);
        throw error;
    }
};

const createBackupConfig = async (backup) => {
    try {
        const response = await axiosInstance.post(API_URL, backup, { 
            headers: { 'Content-Type': 'application/json' } 
        });
        return response.data;
    } catch (error) {
        Logger.error('Error al crear la configuración de respaldo', error);
        throw error;
    }
};

const updateBackupConfig = async (backup) => {
    Logger.log('Lo que se esta recibiendo:',backup)
    try {
        await axiosInstance.put(`${API_URL}/${backup.id}`, backup, { 
            headers: { 'Content-Type': 'application/json' } 
        });
    } catch (error) {
        Logger.error('Error al actualizar la configuración de respaldo', error);
        throw error;
    }
};

const updateBackupEstado = async (id, estadoData) => {
    try {
        await axiosInstance.put(`${API_URL}/${id}/estado`, estadoData, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        Logger.error('Error al actualizar el estado del backup', error);
        throw error;
    }
};

const backupService = {
    getAllBackups,
    getBackupById,
    getBackupByTipo,
    createBackupConfig,
    updateBackupConfig,
    updateBackupEstado
};
export default backupService;