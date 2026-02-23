import React, { useEffect, useState } from "react";
import { BarChart, useAnimateBar, useDrawingArea } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import { CircularProgress, Box, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert,
    useMediaQuery } from "@mui/material";
import PagoService from "../../Services/PagoService";

const mesesNombres = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const GananciasMensualesChart = () => {
    const [añosDisponibles, setAñosDisponibles] = useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const chartHeight = isSmallScreen ? 350 : 500;

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
            console.error(error);
        }
        };
        fetchAños();
    }, []);

    useEffect(() => {
        if (!añoSeleccionado) return;

        const fetchMeses = async () => {
        try {
            const response = await PagoService.getMesesConPagos(añoSeleccionado);
            console.log("Datos recibidos para el año", response);
            const formattedData = response.map((item) => ({
                mes: mesesNombres[item.mes - 1],
                gananciasNIO: item.totalGananciasNIO,
                gananciasUSD: item.totalGananciasUSD,
            }));

            setChartData(formattedData);
        } catch (error) {
            console.error(error);
            setOpenSnackbar(true);
        }
        };

        fetchMeses();
    }, [añoSeleccionado]);

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">
                Ganancias Mensuales
                </Typography>

                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel>Año</InputLabel>
                <Select
                    value={añoSeleccionado || ""}
                    onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                    size="small"
                >
                    {añosDisponibles.map((año) => (
                    <MenuItem key={año} value={año}>
                        {año}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>

            {chartData ? (
                <BarChart
                    height={chartHeight}
                    dataset={chartData}
                    layout="horizontal"
                    xAxis={[
                        {
                            id: "nio",
                            min: 0,
                            valueFormatter: (v) => `C$${v.toLocaleString()}`,
                            disableTicks: true,
                            tickLabelStyle: { display: "none" },
                        },
                        {
                            id: "usd",
                            min: 0,
                            valueFormatter: (v) => `$${v.toFixed(2)}`,
                        },
                        ]}
                        series={[
                        {
                            id: "gananciasNIO",
                            dataKey: "gananciasNIO",
                            label: "Ganancias NIO",
                            xAxisId: "nio",
                            color: "#1976d2",
                            valueFormatter: (v) => `C$${v.toLocaleString()}`,
                        },
                        {
                            id: "gananciasUSD",
                            dataKey: "gananciasUSD",
                            label: "Ganancias USD",
                            xAxisId: "usd",
                            color: "#2e7d32",
                            valueFormatter: (v) => `$${v.toFixed(2)}`,
                        },
                    ]}
                    yAxis={[
                        {
                        scaleType: "band",
                        dataKey: "mes",
                        width: 110,
                        },
                    ]}
                    barLabel={(v) => {
                        if (v.seriesId === "gananciasNIO") {
                        return `C$${v.value.toLocaleString()}`;
                        }
                        return `$${v.value.toFixed(2)}`;
                    }}
                    slots={{
                        bar: BarShadedBackground,
                    }}
                />
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", height: 300 }}>
                <CircularProgress size={24} />
                </Box>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">
                Error al cargar los datos.
                </Alert>
            </Snackbar>
        </Box>
    );
};
export default GananciasMensualesChart;

function BarShadedBackground(props) {
    const { ownerState, ...other } = props;
    const theme = useTheme();
    const animatedProps = useAnimateBar(props);
    const { width } = useDrawingArea();

    return (
        <>
        <rect
            {...other}
            fill={(theme.vars || theme).palette.text.primary}
            opacity={theme.palette.mode === "dark" ? 0.05 : 0.08}
            x={other.x}
            width={width}
        />

        <rect
            {...other}
            opacity={ownerState?.isFaded ? 0.3 : 1}
            {...animatedProps}
        />
        </>
    );
}