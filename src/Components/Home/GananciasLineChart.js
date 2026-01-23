import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import PagoService from "../../Services/PagoService";
import { CircularProgress, Box, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import InsightsIcon from '@mui/icons-material/Insights';

const GananciasLineChart = () => {
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [añoInicio, setAñoInicio] = useState(null);
    const [añoFin, setAñoFin] = useState(null);
    const [error, setError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const chartWidth = isSmallScreen ? 500 : isMediumScreen ? 500 : 700;
    const chartHeight = isSmallScreen ? 250 : 350;
    const leftMargin = isSmallScreen ? 70 : 50;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PagoService.getAñosConPagos();

                const sortedData = response.sort((a, b) => a.año - b.año);
                setData(sortedData);

                if (sortedData.length > 0) {
                    const años = sortedData.map((item) => item.año);
                    setAñosDisponibles(años);
                    const ultimoAño = años[años.length - 1];
                    const primerAñoPosible = años[0];
                    const añoInicioPredeterminado = Math.max(ultimoAño - 4, primerAñoPosible);
                    setAñoInicio(añoInicioPredeterminado);
                    setAñoFin(ultimoAño);
                }
            } catch (error) {
                console.error("Error al obtener datos de pagos:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!data.length || !añoInicio || !añoFin) return;
        const datosFiltrados = data.filter((item) => item.año >= añoInicio && item.año <= añoFin);
        setChartData({
            xAxis: datosFiltrados.map((item) => item.año.toString()),
            series: [
                {
                    label: "Ganancia Anual",
                    data: datosFiltrados.map((item) => item.totalGanancias),
                    color: "#43A047",
                },
            ],
        });
    }, [añoInicio, añoFin, data]);

    const handleAñoFinChange = (e) => {
        const nuevoAñoFin = Number(e.target.value);
        if (nuevoAñoFin < añoInicio) {
            setError(true);
            setOpenSnackbar(true);
        } else {
            setError(false);
        }
        setAñoFin(nuevoAñoFin);
    };

    if (!chartData) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ textAlign: "center", mt: 4, width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <InsightsIcon color="primary" />
                <Typography variant="h5" gutterBottom>
                    Ganancias por Año
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, width: "100%" }}>
                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                    <InputLabel>Año Inicio</InputLabel>
                    <Select value={añoInicio || ""} onChange={(e) => setAñoInicio(Number(e.target.value))}>
                        {añosDisponibles.map((año) => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="filled" sx={{ minWidth: 120 }} error={error}>
                    <InputLabel>Año Fin</InputLabel>
                    <Select value={añoFin || ""} onChange={handleAñoFinChange}>
                        {añosDisponibles.map((año) => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ width: "100%", maxWidth: "100%", display: "flex", justifyContent: "center" }}>
                <LineChart
                    width={chartWidth}
                    height={chartHeight}
                    margin={{ left: leftMargin, right: 30, top: 30, bottom: 30 }}
                    xAxis={[{ scaleType: "point", data: chartData.xAxis }]}
                    series={chartData.series}
                />
            </Box>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
                    El año final no puede ser menor al año inicial.
                </Alert>
            </Snackbar>
        </Box>
    );
};
export default GananciasLineChart;