import {
  Container, Box, Card, CardContent, Typography, CircularProgress, TextField, Chip, Avatar, InputAdornment, IconButton, Tooltip,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import CustomSnackbar from '../../Shared/Components/CustomSnackbar';
import { getNombreDia } from "../../Utils/Constants";
import { useNavigate } from 'react-router-dom';

const ProgressCircle = ({ value, theme }) => (
    <Box position="relative" display="inline-flex">
        <CircularProgress
            variant="determinate"
            value={value}
            size={90}
            thickness={6}
            sx={{
                color: value === 100 ? theme.palette.success.main : theme.palette.primary.main,
            }}
        />
        <Box
            position="absolute"
            top={0} left={0} right={0} bottom={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            >
            <Typography variant="subtitle1" fontWeight="bold" color={value === 100 ? 'success.main' : 'text.primary'}>
                {Math.round(value)}%
            </Typography>
        </Box>
    </Box>
);

export default function ClienteProgreso({ theme, clienteIdInput, setClienteIdInput, clienteId, progresos, loading, error, progresoNiveles,
    handleFetchProgresos, getIconByTipo, getColorByTipo, calcularProgreso, agruparPorNivel, clienteInfo, snackbar, setSnackbar, authenticated }) {
        const navigate = useNavigate();
    return (
        <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                gap={3}
                mb={4}
            >
                <Box flex={1}>
                    {clienteInfo ? (
                        <>
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    color: 'primary.main',
                                    lineHeight: 1.2,
                                    letterSpacing: 0.5
                                }}
                            >
                                ¡Hola{' '}
                                <Box component="span" sx={{ color: 'secondary.main' }}>
                                    {clienteInfo.nombres} {clienteInfo.apellidos}
                                </Box>
                                !
                            </Typography>

                            <Typography variant="h6" color="text.secondary">
                                Aquí están tus progresos
                            </Typography>

                            <Box mt={2} display="flex" gap={2} overflow="auto">
                                {progresoNiveles?.map((nivel) => (
                                    <Card
                                        key={nivel.nivel}
                                        sx={{
                                            minWidth: 120,
                                            p: 1,
                                            borderRadius: 2,
                                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                                            {nivel.nivel}
                                        </Typography>
                                        <ProgressCircle value={nivel.porcentajeAvance} theme={theme} />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
                                            {nivel.programasCompletados}/{nivel.totalProgramas} programas
                                        </Typography>
                                    </Card>
                                ))}
                            </Box>

                        </>
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            Progresos
                        </Typography>
                    )}
                </Box>
                {authenticated && (
                    <Box
                        sx={{
                            width: { xs: '100%', md: 320 },
                            flexShrink: 0
                        }}
                    >
                    <TextField
                        fullWidth
                        label="Código del Cliente"
                        variant="outlined"
                        value={clienteIdInput}
                        onChange={(e) => setClienteIdInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFetchProgresos();
                        }}
                        slotProps={{
                            input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                <Tooltip title="Buscar Progreso">
                                    <IconButton
                                    onClick={handleFetchProgresos}
                                    edge="end"
                                    color="primary"
                                    >
                                    <SearchIcon />
                                    </IconButton>
                                </Tooltip>
                                </InputAdornment>
                            ),
                            },
                        }}
                    />
                    </Box>
                )}

            </Box>

            {loading && <Box display="flex" justifyContent="center" mt={6}><CircularProgress size={60} thickness={5} /></Box>}

            {!loading && progresos.length > 0 && (
                <Box mt={4}>
                    {Object.entries(agruparPorNivel(progresos)).map(([nivel, progresosNivel]) => (
                        <Accordion key={nivel} defaultExpanded sx={{ mb: 2 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                bgcolor: theme.palette.mode === 'dark'
                                    ? theme.palette.paper
                                    : theme.palette.grey[200],
                                borderRadius: 2,
                                px: 2,
                                }}
                            >
                                <Typography variant="h6" fontWeight="medium">Nivel {nivel}</Typography>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: 0 }}>
                                <Box display="flex" flexDirection="column" gap={3} px={2} py={1}>
                                {progresosNivel.map((progreso) => {
                                    const progresoValue = calcularProgreso(progreso.diaPrograma, progreso.programaFit?.duracion);

                                    return (
                                    <Card
                                        key={progreso.id}
                                        onClick={() => navigate(`/programas/${progreso.programaFitId}/details`)}
                                        sx={{
                                        width: '100%',
                                        borderRadius: 3,
                                        borderLeft: `8px solid ${getColorByTipo(progreso.programaFit?.tipo, theme)}`,
                                        boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0px 8px 20px rgba(0,0,0,0.15)' },
                                        }}
                                    >
                                        <CardContent>
                                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" gap={2}>
                                            <Box flex={1}>
                                            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                                <Avatar sx={{ bgcolor: getColorByTipo(progreso.programaFit?.tipo, theme), width: 38, height: 38 }}>
                                                {getIconByTipo(progreso.programaFit?.tipo)}
                                                </Avatar>
                                                <Typography variant="h6" fontWeight="bold">{progreso.programaFit?.titulo} - {getNombreDia(progreso.diaSemana)} </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                {progreso.programaFit?.tipo} · Nivel {progreso.programaFit?.nivel}
                                            </Typography>
                                            <Chip
                                                label={progreso.completado ? 'Completado' : 'En progreso'}
                                                color={progreso.completado ? 'success' : 'primary'}
                                                size="small"
                                                sx={{ mb: 1 }}
                                            />
                                            <Typography variant="body2">Día {progreso.diaPrograma} de {progreso.programaFit?.duracion}</Typography>
                                            </Box>

                                            <Box textAlign={{ xs: 'left', md: 'center' }} mt={{ xs: 2, md: 0 }}>
                                            <ProgressCircle value={progresoValue} theme={theme} />
                                            {progreso.fechaCompletado && (
                                                <Typography variant="caption" display="block" mt={1} color="success.main">
                                                    {new Date(progreso.fechaCompletado).toLocaleDateString()}
                                                </Typography>
                                            )}
                                            </Box>
                                        </Box>
                                        </CardContent>
                                    </Card>
                                    );
                                })}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </Container>
    );
}