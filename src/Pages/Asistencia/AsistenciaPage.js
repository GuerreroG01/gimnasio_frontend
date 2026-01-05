import React, { useEffect } from 'react';
import AsistenciaService from '../../Services/AsistenciaService';
import Asistencia from '../../Components/Asistencia/Asistencia';

export default function AsistenciaPage(){
    const [clientId, setClientId] = React.useState('');
    const [cliente, setCliente] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(false);
    const [fade, setFade] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState(null);
    const [registrarAsistencia, setRegistrarAsistencia] = React.useState(true);

    useEffect(() => {
        const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            setShowInfo(false);
            setClientId('');
            setFade(false);
            if (timeoutId) {
            clearTimeout(timeoutId);
            }
        }
        };

        window.addEventListener('keydown', handleEscapeKey);
        return () => {
        window.removeEventListener('keydown', handleEscapeKey);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        };
    }, [timeoutId]);

    const handleInputChange = (e) => {
        setClientId(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        fetchAsistencias();
        }
    };

    const fetchAsistencias = async () => {
        if (!clientId) {
            setError('Por favor ingresa un ID de cliente.');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const ahora = new Date();
            const fechaLocal = ahora.toLocaleDateString('es-ES', {
                timeZone: 'America/Managua',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split('/').reverse().join('-');

            const horaLocal = ahora.toTimeString().split(' ')[0];
            console.log('Fecha registrada:', fechaLocal);

            const nuevaAsistencia = {
                codigoCliente: parseInt(clientId),
                fecha: fechaLocal,
                hora: horaLocal
            };
            if (registrarAsistencia) {
                await AsistenciaService.postAsistencias(nuevaAsistencia);
            } else {
                console.log('El registro de asistencia está desactivado, solo se mostrará la información.');
            }

            const data = await AsistenciaService.getAsistencias(clientId);
            console.log('Información del cliente:', data);
            setCliente(data);
            setShowInfo(true);
            setFade(true);
            setOpenSnackbar(true);

            if (timeoutId) {
            clearTimeout(timeoutId);
            }
            const id = setTimeout(() => {
            setShowInfo(false);
            setFade(false);
            }, 10000);
            setTimeoutId(id);

        } catch (err) {
            setError('No se pudo obtener la información.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };
    return(
        <Asistencia
        showInfo={showInfo}
        clientId={clientId}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        registrarAsistencia={registrarAsistencia}
        setRegistrarAsistencia={setRegistrarAsistencia}
        error={error}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        loading={loading}
        cliente={cliente}
        fade={fade}
        />
    );
}