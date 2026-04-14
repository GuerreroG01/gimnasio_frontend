import React, { useEffect } from "react";
import { BarChart } from "@mui/x-charts";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Snackbar,
    Alert,
    useMediaQuery,
} from "@mui/material";
import PagoService from "../../Services/PagoService";

const mesesNombres = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const GananciasMensualesChart = ({ pagosData }) => {
    const [añosDisponibles, setAñosDisponibles] = React.useState([]);
    const [añoSeleccionado, setAñoSeleccionado] = React.useState(null);
    const [chartData, setChartData] = React.useState(null);
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

                const formattedData = response.map(item => ({
                    mes: mesesNombres[item.mes - 1],
                    gananciasNIO: item.totalGananciasNIO,
                    gananciasUSD: item.totalGananciasUSD,
                }));

                setChartData(formattedData);
            } catch (error) {
                console.error(error);
                setChartData(null);
                setOpenSnackbar(true);
            }
        };

        fetchMeses();
    }, [añoSeleccionado]);

    return (
        <Box sx={{ width: "100%", textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">Ganancias Mensuales</Typography>

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
                    xAxis={[
                        {
                            id: "nio",
                            valueFormatter: (v) => `C$${v.toLocaleString()}`,
                        }
                    ]}
                    yAxis={[
                        { scaleType: "band", dataKey: "mes", width: 110 }
                    ]}
                    series={[
                        {
                            id: "ganancias",
                            dataKey: "gananciasNIO",
                            label: "Ingresos",
                            color: "#19d241",

                            valueFormatter: (value, context) => {
                                const dataIndex = context?.dataIndex;
                                const row = chartData[dataIndex];

                                if (!row) return "";

                                return `C$${row.gananciasNIO.toLocaleString()} | $${row.gananciasUSD.toFixed(2)}`;
                            },
                        }
                    ]}
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