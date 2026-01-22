import axiosInstance from './AxiosInstance';

const API_URL = '/ProgramaFit';

const getProgramas = async () => {
    try {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener programas', error.response?.data || error);
        throw error;
    }
};

const getProgramaPorId = async (id) => {
    if (!id) throw new Error('Debe especificar el ID del programa');
    try {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el programa con ID ${id}`, error.response?.data || error);
        throw error;
    }
};

const postPrograma = async (programa) => {
    try {
        const response = await axiosInstance.post(API_URL, programa);
        return response.data;
    } catch (error) {
        console.error('Error al crear el programa', error.response?.data || error);
        throw error;
    }
};

const putPrograma = async (id, programa) => {
    if (!id) throw new Error('Debe especificar el ID del programa');
    try {
        const response = await axiosInstance.put(`${API_URL}/${id}`, programa);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar el programa con ID ${id}`, error.response?.data || error);
        throw error;
    }
};

const deletePrograma = async (id) => {
    if (!id) throw new Error('Debe especificar el ID del programa');
    try {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar el programa con ID ${id}`, error.response?.data || error);
        throw error;
    }
};

// ------------------- EJERCICIOS -------------------

const getRutinas = async (pageNumber = 1, pageSize = 10) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/rutinas`, {
            params: { pageNumber, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener rutinas`, error.response?.data || error);
        throw error;
    }
};

const postRutinas = async (rutina, videoFile) => {
    const formData = new FormData();
    formData.append("Ejercicio", rutina.ejercicio);
    formData.append("Series", rutina.series);
    formData.append("Repeticiones", rutina.repeticiones);
    formData.append("Descanso", rutina.descanso);

    if (rutina.ContenidoPlanId) {
        formData.append("ContenidoPlanId", rutina.ContenidoPlanId);
    }

    if (videoFile) {
        formData.append("video", videoFile);
    }

    const response = await axiosInstance.post(`${API_URL}/rutinas`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

const putRutina = async (id, rutina, videoFile, removeVideo) => {
    const formData = new FormData();
    formData.append("Ejercicio", rutina.ejercicio);
    formData.append("Series", rutina.series);
    formData.append("Repeticiones", rutina.repeticiones);
    formData.append("Descanso", rutina.descanso);

    if (rutina.ContenidoPlanId) {
        formData.append("ContenidoPlanId", rutina.ContenidoPlanId);
    }

    if (videoFile) formData.append("video", videoFile);

    formData.append("removeVideo", removeVideo ? "true" : "false");
    console.log("Datos para actualizar rutina:", id, rutina, videoFile, removeVideo);
    const response = await axiosInstance.put(`${API_URL}/rutinas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

const deleteRutina = async (id) => {
    try {
        const response = await axiosInstance.delete(`${API_URL}/rutinas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la rutina ${id}`, error.response?.data || error);
        throw error;
    }
};

// ------------------- EXPORT -------------------

const ProgramaFitService = {
    getProgramas,
    getProgramaPorId,
    postPrograma,
    putPrograma,
    deletePrograma,
    getRutinas,
    postRutinas,
    putRutina,
    deleteRutina,
};

export default ProgramaFitService;