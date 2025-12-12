import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import PagoService from "../../Services/PagoService";
import { CircularProgress, Box, FormControl, InputLabel, MenuItem, Select, Container, Typography, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";

const mesesNombres = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const GananciasMensualesChart = () => {
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);
    const [chartData, setChartData] = useState(null);
    //eslint-disable-next-line
    const [error, setError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const chartWidth = isSmallScreen ? 350 : isMediumScreen ? 600 : 700;
    const chartHeight = isSmallScreen ? 300 : 400;
    const leftMargin = isSmallScreen ? 80 : 60; 

    useEffect(() => {
        const fetchAños = async () => {
            try {
                const response = await PagoService.getAñosConPagos();
                const años = response.map((item) => item.año).sort((a, b) => a - b);
                setAñosDisponibles(años);
                if (años.length > 0) {
                    setAñoSeleccionado(años[años.length - 1]);
                }
            } catch (error) {
                console.error("Error al obtener los años con pagos:", error);
            }
        };

        fetchAños();
    }, []);

    useEffect(() => {
        if (!añoSeleccionado) return;

        const fetchMeses = async () => {
            try {
                const response = await PagoService.getMesesConPagos(añoSeleccionado);
                setChartData({
                    xAxis: response.map((item) => mesesNombres[item.mes - 1]),
                    series: [
                        {
                            label: "Total Ganancias",
                            data: response.map((item) => item.totalGanancias),
                            area: true,
                            color: "#073D7A",
                        },
                    ],
                });
            } catch (error) {
                console.error("Error al obtener los meses con pagos:", error);
                setError(true);
                setOpenSnackbar(true);
            }
        };

        fetchMeses();
    }, [añoSeleccionado]);

    return (
        <Container sx={{ textAlign: "center", mt: 4, width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <InsightsIcon color="primary" />
                <Typography variant="h5" gutterBottom>
                    Ganancias Mensuales
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                    <InputLabel>Año</InputLabel>
                    <Select value={añoSeleccionado || ""} onChange={(e) => setAñoSeleccionado(Number(e.target.value))}>
                        {añosDisponibles.map((año) => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                {chartData ? (
                    <LineChart
                        width={chartWidth}
                        height={chartHeight}
                        margin={{ left: leftMargin, right: 30, top: 30, bottom: 90 }}
                        xAxis={[
                            {
                                scaleType: "point",
                                data: chartData.xAxis,
                                tickLabelStyle: { fontSize: 12, angle: -20},
                            },
                        ]}
                        series={chartData.series}
                    />
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
                    Error al cargar los datos. Intenta nuevamente.
                </Alert>
            </Snackbar>
        </Container>
    );
};
export default GananciasMensualesChart;