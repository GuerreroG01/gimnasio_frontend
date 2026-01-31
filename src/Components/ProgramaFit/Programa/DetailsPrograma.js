import React, { useState } from 'react';
import { Box, Container, Typography, Chip, Stack, Divider, Accordion, AccordionSummary, AccordionDetails,
    Grid, Card } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function DetailsPrograma() {
    const location = useLocation();
    const programa = location.state?.programa;
    console.log('Programa recibido en DetailsPrograma:', programa);
    const theme = useTheme();
    const [expandedPanels, setExpandedPanels] = useState({});

    if (!programa) return <Container sx={{ py: 4, bgcolor: theme.palette.background.paper, maxWidth: 'none', px: 4 }}><Typography color="text.primary">No se encontró el programa.</Typography></Container>;
    const API_DEMOSTRACIONES = (window._env_ ? window._env_.REACT_APP_VIDEODEMOSTRACION_URL : process.env.REACT_APP_VIDEODEMOSTRACION_URL);
    return (
        <Container sx={{ py: 4, bgcolor: theme.palette.background.paper, minHeight: '100vh', maxWidth: 'none', px: 4 }}>
            <Card elevation={4} sx={{ mb: 4, p: 3, borderRadius: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: 'primary.contrastText' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="inherit">
                    {programa.titulo}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={programa.nivel} color="secondary" />
                    <Chip label={programa.tipo} color="secondary" />
                    <Chip
                        icon={<CalendarMonthIcon />}
                        label={`${programa.diaNombre}`}
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
        </Container>
    );
}