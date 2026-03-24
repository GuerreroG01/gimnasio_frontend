import axiosInstance from './AxiosInstance';

const API_URL = "/Report";

const downloadReporteFinanciero = () => {
  return axiosInstance.get(`${API_URL}/download-reporte-ingresos`, {
    responseType: 'blob'
  });
};

const downloadReporteMejores = () => {
  return axiosInstance.get(`${API_URL}/download-reporte-mejores`, {
    responseType: 'blob'
  });
};

const downloadReporteNuevos = () => {
  return axiosInstance.get(`${API_URL}/descargar-reporte-nuevos`, {
    responseType: 'blob'
  });
};

const downloadReporteAsistencia = () => {
  return axiosInstance.get(`${API_URL}/descargar-reporte-asistencia`, {
    responseType: 'blob'
  });
};

const ReportService = {
  downloadReporteFinanciero,
  downloadReporteMejores,
  downloadReporteNuevos,
  downloadReporteAsistencia
};

export default ReportService;