import React, { useEffect } from "react";
import { BarChart, useAnimateBar, useDrawingArea } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, Snackbar, Alert, useMediaQuery } from "@mui/material";
import PagoService from "../../Services/PagoService";

const mesesNombres = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const GananciasMensualesChart = ({ pagosData }) => {
    const [añosDisponibles, setAñosDisponibles] = React.useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = React.useState(null);
    const [chartData, setChartData] = React.useState(null);
    const [monedas, setMonedas] = React.useState([]);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const chartHeight = isSmallScreen ? 350 : 500;

    useEffect(() => {
        if (pagosData.length > 0) {
            const años = pagosData.map(item => item.año).sort((a, b) => a - b);
            setAñosDisponibles(años);
            setAñoSeleccionado(años[años.length - 1]);
        }
    }, [pagosData]);

    useEffect(() => {
        if (!añoSeleccionado) return;

        const fetchMeses = async () => {
            try {
                const response = await PagoService.getMesesConPagos(añoSeleccionado);

                if (!response || response.length === 0) {
                    setChartData(null);
                    setMonedas([]);
                    setOpenSnackbar(true);
                    return;
                }

                // 🔥 detectar monedas dinámicamente
                const currencySet = new Set();

                const formattedData = response.map(item => {
                    const row = {
                        mes: mesesNombres[item.mes - 1],
                        ...item.totalesPorMoneda
                    };

                    Object.keys(item.totalesPorMoneda || {}).forEach(moneda => {
                        currencySet.add(moneda);
                    });

                    return row;
                });

                setMonedas(Array.from(currencySet));
                setChartData(formattedData);

            } catch (error) {
                console.error(error);
                setChartData(null);
                setMonedas([]);
                setOpenSnackbar(true);
            }
        };

        fetchMeses();
    }, [añoSeleccionado]);

    const series = monedas.map((moneda, index) => ({
        id: moneda,
        dataKey: moneda,
        label: `Ingresos (${moneda})`,
        color: ["#1976d2", "#2e7d32"][index % 2],
        valueFormatter: (v) => `${moneda} ${Number(v).toLocaleString()}`
    }));

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Ingresos Mensuales</Typography>

                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                    <InputLabel>Año</InputLabel>
                    <Select
                        value={añoSeleccionado || ""}
                        onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                        size="small"
                    >
                        {añosDisponibles.map(año => (
                            <MenuItem key={año} value={año}>{año}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {chartData && chartData.length > 0 ? (
                <BarChart
                    height={chartHeight}
                    dataset={chartData}
                    layout="horizontal"
                    series={series}
                    yAxis={[
                        {
                            scaleType: "band",
                            dataKey: "mes",
                            width: 110
                        }
                    ]}
                    slots={{ bar: BarShadedBackground }}
                />
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: chartHeight }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Aún no hay datos para el año seleccionado.
                    </Typography>
                </Box>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert severity="error">
                    No se encontraron datos para el año seleccionado.
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
            <rect {...other} fill={(theme.vars || theme).palette.text.primary} opacity={theme.palette.mode === "dark" ? 0.05 : 0.08} x={other.x} width={width} />
            <rect {...other} opacity={ownerState?.isFaded ? 0.3 : 1} {...animatedProps} />
        </>
    );
}