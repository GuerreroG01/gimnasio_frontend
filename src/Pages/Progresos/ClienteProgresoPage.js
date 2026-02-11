import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ClienteProgresoService from '../../Services/ClienteProgresoService';
import ClienteService from '../../Services/ClienteService';
import ClienteProgreso from '../../Components/Progresos/ClienteProgreso';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';

export const getIconByTipo = (tipo) => {
    switch (tipo) {
        case 'Cardio': return <DirectionsRunIcon />;
        case 'Fuerza': return <FitnessCenterIcon />;
        default: return <SportsHandballIcon />;
    }
};

export const getColorByTipo = (tipo, theme) => {
    switch (tipo) {
        case 'Cardio': return theme.palette.error.main;
        case 'Fuerza': return theme.palette.success.main;
        default: return theme.palette.primary.main;
    }
};

export const calcularProgreso = (diaPrograma, duracion) => {
    if (!duracion || duracion === 0) return 0;
    return Math.min((diaPrograma / duracion) * 100, 100);
};

export default function ClienteProgresoPage() {
    const theme = useTheme();
    const [clienteIdInput, setClienteIdInput] = React.useState('');
    const [clienteId, setClienteId] = React.useState(null);
    const [progresos, setProgresos] =React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [clienteInfo, setClienteInfo] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "info",
    })

    const fetchClienteInfo = async (id) => {
        try {
            const response = await ClienteService.getClienteById(id);
            setClienteInfo(response.data);
        } catch (error) {
            console.error("Error obteniendo info del cliente:", error);
            setClienteInfo(null);
        }
    };

    const handleFetchProgresos = async () => {
        if (!clienteIdInput) {
            setSnackbar({
                open: true,
                message: 'Por favor ingresa un código de cliente.',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);
        setError(null);
        setClienteId(clienteIdInput);
        setProgresos([]);

        try {
            const data = await ClienteProgresoService.getProgresosByCliente(clienteIdInput);
            setProgresos(data);
            await fetchClienteInfo(clienteIdInput);
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Error al cargar los progresos del cliente.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const agruparPorNivel = (progresos) => progresos.reduce((acc, progreso) => {
        const nivel = progreso.programaFit?.nivel || 'Sin nivel';
        if (!acc[nivel]) acc[nivel] = [];
            acc[nivel].push(progreso);
        return acc;
    }, {});
    useEffect(() => {
        if (error) {
            setSnackbar({
            open: true,
            message: error,
            severity: "error",
            });
        }
    }, [error]);

    useEffect(() => {
        if (!loading && !error && clienteId && progresos.length === 0) {
            setSnackbar({
            open: true,
            message: "No hay progresos para este cliente.",
            severity: "info",
            });
        }
    }, [loading, error, clienteId, progresos]);
    return (
        <ClienteProgreso
            theme={theme}
            clienteIdInput={clienteIdInput}
            setClienteIdInput={setClienteIdInput}
            clienteId={clienteId}
            progresos={progresos}
            loading={loading}
            error={error}
            handleFetchProgresos={handleFetchProgresos}
            getIconByTipo={getIconByTipo}
            getColorByTipo={getColorByTipo}
            calcularProgreso={calcularProgreso}
            agruparPorNivel={agruparPorNivel}
            clienteInfo={clienteInfo}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
        />
    );
}