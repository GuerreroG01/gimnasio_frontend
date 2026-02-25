import React, { useEffect } from 'react';
import { 
    Container, Typography, Card, FormControl, InputLabel, Select, MenuItem, 
    Button, Box, Paper, Divider, Stack, CircularProgress, Alert, useTheme, CardContent
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Tooltip from '@mui/material/Tooltip';
import BackupIcon from '@mui/icons-material/Backup';
import SaveIcon from '@mui/icons-material/Save';
import BackupService from '../../../Services/BackupService';
import CustomSnackbar from '../../../Shared/Components/CustomSnackbar';

const calcularProximoRespaldo = (frecuencia, fechaAnterior) => {
    let fechaBase = fechaAnterior ? new Date(fechaAnterior) : new Date();
    switch (frecuencia) {
        case 'dia':
            fechaBase.setDate(fechaBase.getDate() + 1);
            break;
        case 'semana':
            fechaBase.setDate(fechaBase.getDate() + 7);
            break;
        case 'quincena':
            fechaBase.setDate(fechaBase.getDate() + 15);
            break;
        case 'mes':
            fechaBase.setMonth(fechaBase.getMonth() + 1);
            break;
        case 'año':
            fechaBase.setFullYear(fechaBase.getFullYear() + 1);
            break;
        default:
            return null;
    }
    return fechaBase.toISOString();
};

const mapBackupFromBackend = (data) => ({
    id: data.id,
    frecuenciaRespaldo: data.frecuenciaRespaldo,
    proximoRespaldo: data.proximoRespaldo,
    fechaRespaldoAnterior: data.fechaRespaldoAnterior,
    tipo: data.tipo,
    estadoUltimoRespaldo: data.estadoUltimoRespaldo,
    rutaRespaldo: data.rutaRespaldo
});

const ConfigBackup = () => {
    const [backup, setBackup] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [frecuencia, setFrecuencia] = React.useState('');
    const [proximoRespaldo, setProximoRespaldo] = React.useState('');
    const [cambiosPendientes, setCambiosPendientes] = React.useState(false);
    const theme = useTheme();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchBackupConfig = async () => {
            try {
                const data = await BackupService.getBackupByTipo("BaseDatos");
                console.log('Datos obtenidos:',data);
                if (!data) {
                    setBackup(null);
                    return;
                }
                const formatted = mapBackupFromBackend(data);
                setBackup(formatted);
                setFrecuencia(formatted.frecuenciaRespaldo);
                setProximoRespaldo(formatted.proximoRespaldo);
            } catch (err) {
                console.error("Error al cargar la configuración de respaldo:", err);
                setError("Ocurrió un problema al conectar con el servidor.");
            } finally {
                setLoading(false);
            }
        };
        fetchBackupConfig();
    }, []);

    const handleUpdate = async (nuevaFrecuencia) => {
        if (!backup) return;
        const nuevoRespaldo = calcularProximoRespaldo(nuevaFrecuencia, backup.fechaRespaldoAnterior);
        setProximoRespaldo(nuevoRespaldo);

        try {
            const updatedBackup = {
                ...backup,
                FrecuenciaRespaldo: nuevaFrecuencia,
                ProximoRespaldo: nuevoRespaldo
            };

            await BackupService.updateBackupConfig(updatedBackup);
            setBackup(updatedBackup);

            setSnackbar({
                open: true,
                message: 'La configuración de respaldo se actualizó correctamente.',
                severity: 'success'
            });
        } catch (err) {
            console.error(err);

            setSnackbar({
                open: true,
                message: 'Ocurrió un error al actualizar la configuración de respaldo.',
                severity: 'error'
            });
        }
    };

    const handleCreateBackupConfig = async () => {
        const defaultFrecuencia = 'mes';

        const now = new Date();
        const utcMinus6 = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        const fechaActualUTCMinus6 = utcMinus6.toISOString();

        const newBackup = {
            Tipo: "BaseDatos",
            FrecuenciaRespaldo: defaultFrecuencia,
            FechaRespaldoAnterior: null,
            ProximoRespaldo: fechaActualUTCMinus6,
            EstadoUltimoRespaldo: "Pendiente",
            RutaRespaldo: null
        };

        try {
            const created = await BackupService.createBackupConfig(newBackup);
            setBackup(mapBackupFromBackend(created));
            setFrecuencia(defaultFrecuencia);
            setProximoRespaldo(fechaActualUTCMinus6);
        } catch (err) {
            setError('Error al crear la configuración de respaldo.');
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };

    if (loading) return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>Cargando configuración de respaldo...</Typography>
        </Container>
    );

    if (error) return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    if (!backup) return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Card elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <BackupIcon sx={{ fontSize: 80, color: 'gray' }} />
                <Typography variant="h5" gutterBottom>No hay configuración de respaldo</Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Aún no has configurado un respaldo. Presiona el botón para establecer la configuración predeterminada.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleCreateBackupConfig}>
                    Crear Configuración
                </Button>
            </Card>
        </Container>
    );
    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'completado':
                return 'success.main';
            case 'pendiente':
                return 'warning.main';
            case 'fallido':
                return 'error.main';
            default:
                return 'grey.500';
        }
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper
                }}
                >
                <Typography
                    variant="h4"
                    textAlign="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                    <BackupIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
                    Configuración de Respaldo
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', width: '100%' }}>
                    <Stack sx={{ width: '25%' }} spacing={2}>
                        <Card sx={{ width: '100%', borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: 'secondary.main' }}>
                                    Frecuencia del Respaldo
                                </Typography>
                                <FormControl variant="filled" fullWidth>
                                    <InputLabel>Seleccionar</InputLabel>
                                    <Select
                                        value={frecuencia}
                                        onChange={(e) => {
                                            const nuevaFrecuencia = e.target.value;
                                            setFrecuencia(nuevaFrecuencia);
                                            handleUpdate(nuevaFrecuencia);
                                        }}
                                    >
                                        <MenuItem value="dia">Diario</MenuItem>
                                        <MenuItem value="semana">Semanal</MenuItem>
                                        <MenuItem value="quincena">Quincenal</MenuItem>
                                        <MenuItem value="mes">Mensual</MenuItem>
                                        <MenuItem value="año">Anual</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Stack>

                    <Stack sx={{ width: '70%' }} spacing={2}>
                        <Card sx={{ width: '100%', borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom textAlign="center" sx={{ color: 'secondary.main' }}>
                                    Información de Respaldo
                                </Typography>

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Último Respaldo:</Typography>
                                        <Typography variant="body1">{formatearFecha(backup.fechaRespaldoAnterior)}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Próximo Respaldo:</Typography>
                                        <Typography variant="body1" color="primary">{formatearFecha(proximoRespaldo)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Estado Último Respaldo:
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Tooltip title={backup.estadoUltimoRespaldo} arrow>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Box
                                                        sx={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            bgcolor: getEstadoColor(backup.estadoUltimoRespaldo),
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </Box>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            Ruta del Respaldo:
                                        </Typography>

                                        {backup.rutaRespaldo ? (
                                            <Tooltip title={backup.rutaRespaldo} arrow>
                                                <FolderOpenIcon
                                                    color="primary"
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="body1">No disponible</Typography>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
                {cambiosPendientes && (
                    <Box textAlign="center" sx={{ mt: 4 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            startIcon={<SaveIcon />} 
                            onClick={() => {
                                handleUpdate();
                                setCambiosPendientes(false);
                            }}
                            sx={{ borderRadius: 2 }}
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                )}
            </Paper>
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box>
    );
};
export default ConfigBackup;