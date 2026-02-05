import { useContext } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { Box, Grid, Card, Tooltip, CardContent, Typography, Chip, Select, MenuItem, FormControl, InputLabel, CircularProgress, Stack, useTheme, IconButton } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import EmptyState from '../../../Shared/Components/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function IndexPrograma({ programas, loading, nivel, setNivel, tipo, setTipo, nivelesDisponibles, tiposDisponibles }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { authenticated } = useContext(AuthContext);
    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
                    Programas de Entrenamiento
                </Typography>
                {authenticated && (
                    <Tooltip title="Nuevo Programa de Entrenamiento">
                        <IconButton onClick={() => navigate('/programas/new')} color="primary">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                mb={4}
            >
                <FormControl
                    sx={{ width: 200 }}
                    disabled={nivelesDisponibles.length === 0}
                >
                    <InputLabel>Nivel</InputLabel>
                    <Select
                        value={nivel}
                        label="Nivel"
                        onChange={(e) => setNivel(e.target.value)}
                    >
                        {nivelesDisponibles.map(n => (
                            <MenuItem key={n} value={n}>{n}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    sx={{ width: 200 }}
                    disabled={tiposDisponibles.length === 0}
                >
                    <InputLabel>Tipo</InputLabel>
                    <Select
                        value={tipo}
                        label="Tipo"
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <MenuItem value="Todos">Todos</MenuItem>
                        {tiposDisponibles.map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {loading && (
                <Box display="flex" justifyContent="center" mt={6}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && nivelesDisponibles.length === 0 && (
                <EmptyState
                    title="No hay niveles disponibles"
                    message="No se encontraron niveles de programas."
                    Icon={SearchOffIcon}
                />
            )}

            {!loading && nivelesDisponibles.length > 0 && tiposDisponibles.length === 0 && (
                <EmptyState
                    title="No hay tipos disponibles"
                    message="No se encontraron tipos para este nivel."
                    Icon={SearchOffIcon}
                />
            )}

            {!loading && nivel && programas.length === 0 && (
                <EmptyState
                    title="No se encontraron programas"
                    message="Intenta cambiar los filtros o crear un nuevo programa."
                    Icon={SearchOffIcon}
                />
            )}

            {!loading && (
                <Grid container spacing={2} alignItems="stretch" justifyContent="center">
                    {programas.map(programa => (
                        <Grid item xs={12} md={6} lg={4} key={programa.id}>
                            <Card
                                onClick={() => navigate(`/programas/${programa.id}/details`, { state: { programa } })}
                                sx={{
                                    width: 300,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    cursor: 'pointer',
                                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        gutterBottom
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {programa.titulo}
                                    </Typography>


                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        mb={2}
                                        flexWrap="wrap"
                                        rowGap={1}
                                        >
                                            <Chip label={programa.nivel} color="primary" size="small" />
                                            <Chip label={programa.tipo} color="secondary" size="small" />
                                    </Stack>


                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        mb={2}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {programa.contenido || 'Programa diseñado para mejorar tu rendimiento.'}
                                    </Typography>

                                    <Stack spacing={1}>
                                        <Typography variant="caption">
                                            <CalendarMonthIcon fontSize="inherit" /> Día {programa.diaNombre}
                                        </Typography>

                                        <Tooltip
                                            title={
                                                <Box>
                                                    {programa.programaRutinas.map((r, index) => (
                                                        <Typography
                                                            key={index}
                                                            variant="caption"
                                                            display="block"
                                                            sx={{ maxWidth: 250 }}
                                                        >
                                                            {r.rutinaFit.ejercicio} - {r.rutinaFit.series} series de {r.rutinaFit.repeticiones} repeticiones
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            }
                                            arrow
                                            placement="top"
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    cursor: 'pointer',
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'normal',
                                                }}
                                            >
                                                <FitnessCenterIcon fontSize="inherit" /> {programa.programaRutinas.length} ejercicios
                                            </Typography>
                                        </Tooltip>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}