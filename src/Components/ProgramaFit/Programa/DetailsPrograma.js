import React, { useContext, useEffect } from 'react';
import { Box, Container, Typography, Chip, Stack, Divider, Accordion, AccordionSummary, AccordionDetails,
    Grid, Card, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteComponent from '../../../Shared/Components/DeleteComponent';
import ProgramaFitService from '../../../Services/ProgramaFitService';
import { AuthContext } from '../../../Context/AuthContext';
import { getNombreDia } from "../../../Utils/Constants";
export default function DetailsPrograma() {
    const location = useLocation();
    const [programa, setPrograma] = React.useState(location.state?.programa || null);
    const theme = useTheme();
    const { authenticated } = useContext(AuthContext);
    const [expandedPanels, setExpandedPanels] = React.useState({});
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [loadingDelete, setLoadingDelete] = React.useState(false);
    const handleDeleteClick = () => setOpenDeleteModal(true);
    const handleDeleteCancel = () => setOpenDeleteModal(false);

    const handleDeleteConfirm = async () => {
        if (!programa?.id) return;

        try {
            setLoadingDelete(true);
            await ProgramaFitService.deletePrograma(programa.id);
            setOpenDeleteModal(false);
            console.log('Programa eliminado:', programa.id);

            navigate('/programas');
        } catch (error) {
            console.error('Error al eliminar el programa:', error);
            setOpenDeleteModal(false);
        } finally {
            setLoadingDelete(false);
        }
    };
    useEffect(() => {
        if (!programa && location.pathname) {
            const id = location.pathname.split('/')[2];
            ProgramaFitService.getProgramaPorId(id).then(setPrograma).catch(console.error);
        }
    }, [programa, location.pathname]);
    if (!programa) return <Container sx={{ py: 4, bgcolor: theme.palette.background.paper, maxWidth: 'none', px: 4 }}><Typography color="text.primary">No se encontró el programa.</Typography></Container>;
    const API_DEMOSTRACIONES = (window._env_ ? window._env_.REACT_APP_VIDEODEMOSTRACION_URL : process.env.REACT_APP_VIDEODEMOSTRACION_URL);

    return (
        <Container sx={{ py: 4, bgcolor: theme.palette.background.paper, minHeight: '100vh', maxWidth: 'none', px: 4 }}>
            <Card elevation={4} sx={{ mb: 4, p: 3, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'primary.contrastText' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" fontWeight="bold" color="inherit">
                        {programa.titulo}
                    </Typography>
                    {authenticated && (
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Editar">
                                <IconButton
                                    onClick={() => navigate(`/programas/${programa.id}/update`)}
                                    sx={{ color: 'white' }}
                                >
                                <EditIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Borrar">
                                <IconButton
                                    onClick={handleDeleteClick}
                                    sx={{ color: 'white' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}    
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={programa.nivel} color="secondary" />
                    <Chip label={programa.tipo} color="secondary" />
                    <Chip
                        icon={<CalendarMonthIcon />}
                        label={programa.diaNombre || getNombreDia(programa.dia)}
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '& .MuiChip-icon': { color: 'white' } }}
                    />
                    <Chip
                        icon={<FitnessCenterIcon />}
                        label={`${programa.programaRutinas.length} ejercicios`}
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '& .MuiChip-icon': { color: 'white' } }}
                    />
                </Stack>
            </Card>
            {programa.contenido && (
                <Card elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
                    <Typography variant="body1" color="text.primary">
                        {programa.contenido}
                    </Typography>
                </Card>
            )}
            <Card elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: theme.palette.background.paper }}>
                <Typography variant="h5" fontWeight="bold" mb={3} color="text.primary">
                    Ejercicios del programa
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                    {programa.programaRutinas.map((item, index) => {
                        const rutina = item.rutinaFit;
                        const rutinaDemostracion = rutina.demostracion ? `${API_DEMOSTRACIONES}/${rutina.demostracion}` : null;
                        const isRutinaString = typeof rutinaDemostracion === "string";
                        const isRutinaGif = isRutinaString && rutinaDemostracion.toLowerCase().endsWith(".gif");
                        const panelId = `${programa.id}-${rutina.id}-${index}`;
                        return (
                            <Grid item xs={12} sm={6} key={panelId}>
                                <Accordion
                                    key={panelId}
                                    expanded={!!expandedPanels[panelId]}
                                    onChange={(event, isExpanded) =>
                                    setExpandedPanels(prev => ({
                                        ...prev,
                                        [panelId]: isExpanded,
                                    }))
                                    }
                                    disableGutters
                                    sx={{
                                    width: 400,
                                    borderRadius: 2,
                                    '&:before': { display: 'none' },
                                    boxShadow: theme.shadows[1],
                                    }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: 2 }}>
                                    <Typography fontWeight="medium" color="text.primary">
                                        {rutina.ejercicio}
                                    </Typography>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{ borderRadius: 2 }}>
                                    {rutina.demostracion ? (
                                        <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Stack spacing={1}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                Series
                                                </Typography>
                                                <Typography color="text.primary">
                                                {rutina.series}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                Repeticiones
                                                </Typography>
                                                <Typography color="text.primary">
                                                {rutina.repeticiones}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                Descanso
                                                </Typography>
                                                <Typography color="text.primary">
                                                {rutina.descanso}
                                                </Typography>
                                            </Box>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12} md={8}>
                                            <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Demostración
                                            </Typography>

                                            <Box
                                                sx={{
                                                width: '100%',
                                                height: 180,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: theme.shadows[2],
                                                backgroundColor: '#000',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mt: 1,
                                                }}
                                            >
                                                {isRutinaGif ? (
                                                <Box
                                                    component="img"
                                                    src={rutinaDemostracion}
                                                    alt="Demostración"
                                                    sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    }}
                                                />
                                                ) : (
                                                <Box
                                                    component="video"
                                                    src={rutinaDemostracion}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    }}
                                                />
                                                )}
                                            </Box>
                                            </Box>
                                        </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid container spacing={2}>
                                        <Grid item xs={6} sm={4}>
                                            <Typography variant="caption" color="text.secondary">
                                            Series
                                            </Typography>
                                            <Typography color="text.primary">
                                            {rutina.series}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Typography variant="caption" color="text.secondary">
                                            Repeticiones
                                            </Typography>
                                            <Typography color="text.primary">
                                            {rutina.repeticiones}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={4}>
                                            <Typography variant="caption" color="text.secondary">
                                            Descanso
                                            </Typography>
                                            <Typography color="text.primary">
                                            {rutina.descanso}
                                            </Typography>
                                        </Grid>
                                        </Grid>
                                    )}

                                    {rutina.programaRutinas?.length > 0 && (
                                        <>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            Este ejercicio también pertenece a:
                                        </Typography>

                                        <Stack spacing={0.5} mt={1}>
                                            {rutina.programaRutinas
                                            .filter(r => r.programaFit)
                                            .map((r, i) => (
                                                <Typography key={i} variant="body2" color="text.primary">
                                                • {r.programaFit.titulo} (Día {r.programaFit.dia})
                                                </Typography>
                                            ))}
                                        </Stack>
                                        </>
                                    )}
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        );
                    })}
                </Grid>
            </Card>
            <DeleteComponent
                open={openDeleteModal}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmColor="error"
                message={
                    <>
                        ¿Está seguro que desea borrar el programa <strong>{programa.titulo}</strong>?
                    </>
                }
                loading={loadingDelete}
            />
        </Container>
    );
}