import { Card, Typography, Box, Chip, Stack, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useTheme } from "@mui/material/styles";

export default function Step3Revision({ form, rutinasSeleccionadas, dia }) {
    const theme = useTheme();
    const nombreDia = dia.find(d => d.number === form.dia)?.name;

    return (
        <Box>
            <Card
                elevation={4}
                sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: "primary.contrastText",
                }}
            >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {form.titulo}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={form.nivel} color="secondary" />
                    <Chip label={form.tipo} color="secondary" />

                    <Chip
                    icon={<CalendarMonthIcon />}
                    label={`${form.duracion} ${form.duracion === 1 ? "día" : "días"}`}
                    variant="outlined"
                    sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                        "& .MuiChip-icon": { color: "white" },
                    }}
                    />

                    <Chip
                    icon={<CalendarMonthIcon />}
                    label={nombreDia}
                    variant="outlined"
                    sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                        "& .MuiChip-icon": { color: "white" },
                    }}
                    />

                    <Chip
                    label={`Orden ${form.orden}`}
                    variant="outlined"
                    sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                    }}
                    />

                    <Chip
                    icon={<FitnessCenterIcon />}
                    label={`${rutinasSeleccionadas.length} ejercicios`}
                    variant="outlined"
                    sx={{
                        color: "white",
                        borderColor: "rgba(255,255,255,0.5)",
                        "& .MuiChip-icon": { color: "white" },
                    }}
                    />

                    <Chip
                    label={form.activo ? "Activo" : "Inactivo"}
                    color={form.activo ? "success" : "default"}
                    />
                </Stack>
            </Card>

            <Card elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Programa Alimenticio
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}>
                        <Typography>{form.contenido}</Typography>
                    </Grid>
                </Grid>
            </Card>

            <Card elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Rutinas del programa
                </Typography>

                {rutinasSeleccionadas.length === 0 ? (
                <Typography color="text.secondary">
                    No se han agregado rutinas
                </Typography>
                ) : (
                <Grid container spacing={2}>
                    {rutinasSeleccionadas.map((r) => (
                        <Grid item xs={12} sm={6} key={r.id}>
                            <Accordion
                                disableGutters
                                sx={{
                                    borderRadius: 2,
                                    "&:before": { display: "none" },
                                    boxShadow: theme.shadows[1],
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography fontWeight="medium">
                                    {r.ejercicio}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Stack spacing={1}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                        Series
                                        </Typography>
                                        <Typography>{r.series}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                        Repeticiones
                                        </Typography>
                                        <Typography>{r.repeticiones}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                        Descanso
                                        </Typography>
                                        <Typography>{r.descanso}</Typography>
                                    </Box>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))}
                </Grid>
                )}
            </Card>
        </Box>
    );
}