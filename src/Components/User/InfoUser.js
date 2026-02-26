import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import UserService from '../../Services/UserService';
import { Paper, Typography, CircularProgress, Box, Stack, Chip, Avatar, Divider, Button } from '@mui/material';
import { AccountCircle, Email, Phone, CalendarToday } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const InfoUser = () => {
    const { userId } = useContext(AuthContext);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const rolMap = {
        "Admin": "Administrador",
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            setError('Usuario no identificado');
            return;
        }

        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await UserService.getUserById(userId);
                setUser(response.data);
                setError(null);
            } catch (err) {
                console.error('Error al obtener usuario:', err);
                setError('No se pudo cargar la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
                <Typography color="error" align="center">{error}</Typography>
            </Paper>
        );
    }

    const handleEditarUsuario = (id) => {
        navigate(`/user/${id}/update`);
    };

    const handleCrearUsuario = () => {
        navigate("/user/register");
    };

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}
            >
                <AccountBoxIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
                Información de Usuario
            </Typography>

            <Box 
                display="flex" 
                flexDirection={{ xs: 'column', md: 'row' }} 
                alignItems={{ xs: 'stretch', md: 'flex-start' }} 
                gap={3}
                justifyContent={user.rol !== "Admin" ? "center" : "flex-start"} // centrado si no es Admin
            >
                {/* Paper principal */}
                <Paper 
                    elevation={3} 
                    sx={{ p: 3, borderRadius: 2, flex: { md: '0 0 300px' }, width: '100%' }}
                >
                    <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                            <AccountCircle fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {user.usuario}
                            </Typography>
                            <Chip 
                                label={user.activo ? 'Activo' : 'Inactivo'} 
                                color={user.activo ? 'success' : 'default'} 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Box>
                    
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Box display="flex" alignItems="center" mb={1}>
                            <Email sx={{ mr: 1, color: 'gray' }} />
                            <Typography>{user.email}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Phone sx={{ mr: 1, color: 'gray' }} />
                            <Typography>{user.telefono}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <AdminPanelSettingsIcon sx={{ mr: 1, color: 'gray' }} />
                            <Typography>
                                {rolMap[user.rol] || user.rol}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <CalendarToday sx={{ mr: 1, color: 'gray' }} />
                            <Typography>{new Date(user.fechaIngreso).toLocaleDateString()}</Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Paper secundario (solo Admin) */}
                {user.rol === "Admin" && (
                    <Paper
                        elevation={6}
                        sx={(theme) => ({
                            p: 4,
                            borderRadius: 3,
                            backgroundColor: theme.palette.background.paper,
                            borderLeft: `6px solid ${theme.palette.success.main}`,
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[10]
                            }
                        })}
                    >
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Gestión de Usuario
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Administra la información del usuario y, si tienes permisos,
                                    crea nuevos usuarios dentro del sistema.
                                </Typography>
                            </Box>

                            <Divider />

                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEditarUsuario(user.id)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Editar Información
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    startIcon={<PersonAddIcon />}
                                    onClick={handleCrearUsuario}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Crear Usuario
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                )}
            </Box>
        </Paper>
    );
};

export default InfoUser;