import React, { useEffect } from 'react';
import AsistenciaService from '../../Services/AsistenciaService';
import Asistencia from '../../Components/Asistencia/Asistencia';
import PagoService from '../../Services/PagoService';
import ClienteProgresoService from '../../Services/ClienteProgresoService';
import ClienteService from '../../Services/ClienteService';

export default function AsistenciaPage(){
    const [clientId, setClientId] = React.useState('');
    const [cliente, setCliente] = React.useState(null);
    const [diasRestantes, setDiasRestantes] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(false);
    const [fade, setFade] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState(null);
    const [registrarAsistencia, setRegistrarAsistencia] = React.useState(true);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "success",
    });

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
            const data = await AsistenciaService.getAsistencias(clientId);
            const pagoData = await PagoService.getUltimoPagoVigente(clientId);
            setCliente(data);
            setDiasRestantes(pagoData.diasRestantes);
            setShowInfo(true);
            setFade(true);
            setOpenSnackbar(true);
            
            if (registrarAsistencia) {
                await AsistenciaService.postAsistencias(clientId);
                setLoading(false);
                const progresoResponse = await ClienteProgresoService.crearSiguienteProgreso(clientId);
                if (progresoResponse?.mensaje) {
                    setSnackbar({
                        open: true,
                        message: progresoResponse.mensaje,
                        severity: progresoResponse.mensaje.includes("!Sigue asi!")
                            ? "info"
                            : "success",
                    });
                }
                await ClienteProgresoService.incrementDiasEnNivel(clientId);
                await ClienteService.actualizarNivelCliente(clientId);
            } else {
                console.log('El registro de asistencia está desactivado, solo se mostrará la información.');
            }

            if (timeoutId) {
            clearTimeout(timeoutId);
            }
            const id = setTimeout(() => {
            setShowInfo(false);
            setFade(false);
            }, 100000);
            setTimeoutId(id);

        } catch (err) {
            setError('No se pudo obtener la información.');
            setOpenSnackbar(true);
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
            diasRestantes={diasRestantes}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
        />
    );
}