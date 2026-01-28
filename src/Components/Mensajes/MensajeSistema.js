import React, { useEffect, useState } from 'react';
import mensajeService from '../../Services/MensajeService';
import configSistemaService from '../../Services/ConfigSistemService';
import { Typography, useTheme, Card, CardContent, Container, Box, Skeleton, Alert, IconButton, Popover, Avatar, List, ListItem, ListItemAvatar, ListItemText, Tooltip, CircularProgress } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmptyState from "../../Shared/Components/EmptyState";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const MensajeSistema = () => {
    const [loading, setLoading] = useState(false);
    const [mensajes, setMensajes] = useState([]);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [usuariosInactivos, setUsuariosInactivos] = useState([]);
    const [loadingInactivos, setLoadingInactivos] = useState(false);
    const theme = useTheme();

    const fetchMessages = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await mensajeService.getMensajesSistema();
            const sortedMessages = response.sort((a, b) => b.codigo - a.codigo);
            setMensajes(sortedMessages);
        } catch (error) {
            setError('Hubo un problema al cargar los mensajes.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenInactivos = async (event, idMensaje) => {
        setAnchorEl(event.currentTarget);
        setLoadingInactivos(true);
        try {
            const data = await configSistemaService.getInactivosByIdMess(idMensaje);
            setUsuariosInactivos(data);
        } catch (err) {
            setUsuariosInactivos([]);
            console.log('Ocurrio un error:',err);
        } finally {
            setLoadingInactivos(false);
        }
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const formatFecha = (fecha) => {
        if (!fecha) return '';
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(fecha));
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Mensajes del Sistema
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" width="100%">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} sx={{ marginBottom: 3, boxShadow: 1, width: '100%' }}>
                            <CardContent>
                                <Skeleton variant="text" width="80%" height={25} sx={{ marginBottom: 1 }} />
                                <Skeleton variant="text" width="60%" height={20} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Alert>
            )}

            {!loading && mensajes.length === 0 && (
                <EmptyState
                    title="Sin mensajes"
                    message="Aquí aparecerán tus mensajes cuando recibas alguno."
                    Icon={ChatBubbleOutlineIcon}
                />
            )}

            <Box sx={{ marginTop: 3 }}>
                {!loading && !error && mensajes.length > 0 && mensajes.map((mensaje) => (
                    <Card
                        key={mensaje.codigo}
                        sx={{
                            marginBottom: 2,
                            bgcolor: theme.palette.background.paper,
                            borderLeft: '6px solid #1976d2',
                            boxShadow: 'none',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            padding: 2,
                            position: 'relative',
                            fontFamily: 'Roboto Mono, monospace',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                right: 8,
                                bottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.background.default
                                        : theme.palette.background.paper,
                                borderRadius: 1,
                                padding: '2px 6px',
                                boxShadow: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? '0 1px 4px rgba(255,255,255,0.1)'
                                        : '0 1px 4px rgba(0,0,0,0.2)',
                                fontSize: '0.75rem',
                                color: (theme) =>
                                    theme.palette.mode === 'dark'
                                        ? theme.palette.primary.light
                                        : theme.palette.primary.main,
                                fontWeight: '500',
                                userSelect: 'none',
                            }}
                        >
                            <EventIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                            {formatFecha(mensaje.fechaEmision)}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                            <SettingsIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                            <Tooltip title="Información detallada de clientes inactivos" arrow>
                                <span>
                                    <IconButton
                                    size="medium"
                                    disabled={loadingInactivos}
                                    onClick={(e) => handleOpenInactivos(e, mensaje.codigo)}
                                    sx={{ position: 'relative' }}
                                    >
                                    <VisibilityIcon fontSize="small" />

                                    {loadingInactivos && (
                                        <CircularProgress
                                        size={24}
                                        sx={{
                                            color: '#1976d2',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                        />
                                    )}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                                {mensaje.motivo}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                                {mensaje.texto}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#424242', fontStyle: 'italic', marginTop: 0.5 }}>
                                Enviado por: <strong>{mensaje.emisor}</strong>
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Box sx={{ p: 2, minWidth: 300 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Usuarios Inactivos
                    </Typography>
                    {loadingInactivos ? (
                        <Typography variant="body2">Cargando...</Typography>
                    ) : usuariosInactivos.length > 0 ? (
                        <List dense>
                            {usuariosInactivos.map((usuario) => (
                                <ListItem key={usuario.codigo} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={`${usuario.nombres} ${usuario.apellidos}`}
                                            src={usuario.foto || undefined}
                                        >
                                            {(usuario.codigo || '')}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${usuario.nombres} ${usuario.apellidos}`}
                                        secondary={`Ultimó Pago: ${formatFecha(usuario.fechaPago)}
                                        Venció: ${formatFecha(usuario.fechaVencimiento)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography variant="body2">No hay usuarios inactivos.</Typography>
                    )}
                </Box>
            </Popover>
        </Container>
    );
};
export default MensajeSistema;