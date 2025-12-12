import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useEffect, useState } from "react";
import PagoService from "../../Services/PagoService";
import { CircularProgress, Box, FormControl, InputLabel, MenuItem, Select, Container, Typography, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";

const PagosAnualChart = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({ xAxis: [], yAxis: [] });
  const [añosDisponibles, setAñosDisponibles] = useState([]);
  const [añoInicio, setAñoInicio] = useState(null);
  const [añoFin, setAñoFin] = useState(null);
  const [error, setError] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PagoService.getAñosConPagos();
        const sortedData = response.sort((a, b) => a.año - b.año);
        setData(sortedData);

        if (sortedData.length > 0) {
          const años = sortedData.map((item) => item.año);
          setAñosDisponibles(años);
          setAñoInicio(años[0]);
          setAñoFin(años[años.length - 1]);
        }
      } catch (error) {
        console.error("Error al obtener datos de pagos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data.length || !añoInicio || !añoFin || añoFin < añoInicio) return;

    const datosFiltrados = data.filter(
      (item) => item.año >= añoInicio && item.año <= añoFin
    );

    setChartData({
      xAxis: datosFiltrados.map((item) => item.año),
      yAxis: datosFiltrados.map((item) => item.pagosRealizados),
    });
  }, [añoInicio, añoFin, data]);

  const handleAñoFinChange = (e) => {
    const nuevoAñoFin = Number(e.target.value);
    if (nuevoAñoFin < añoInicio) {
      setError(true);
      setOpenSnackbar(true);
    } else {
      setError(false);
      setAñoFin(nuevoAñoFin);
    }
  };

  if (!data.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      sx={{
        textAlign: "center",
        mt: isLargeScreen ? 2 : 4,
        mb: isLargeScreen ? 2 : 4,
        width: isLargeScreen ? "70%" : "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <ShowChartIcon color="primary" />
        <Typography variant="h6" gutterBottom>
          Pagos Realizados por Año
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, width: "100%" }}>
        <FormControl variant="filled" sx={{ minWidth: 100 }}>
          <InputLabel>Año Inicio</InputLabel>
          <Select value={añoInicio || ""} onChange={(e) => setAñoInicio(Number(e.target.value))}>
            {añosDisponibles.map((año) => (
              <MenuItem key={año} value={año}>
                {año}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ minWidth: 100 }} error={error}>
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
      {chartData.yAxis.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SparkLineChart
            data={chartData.yAxis}
            height={100}
            width={isSmallScreen ? 280 : isLargeScreen ? 400 : 500}
            colors={["#007BFF"]}
            showPoints
            showTooltip
            xAxis={{
              data: chartData.xAxis.map((year) => year.toString()),
              scaleType: "point",
            }}
          />
        </Box>
      )}
      <Typography variant="caption" sx={{ mt: 2, color: "gray" }}>
        Línea azul: Cantidad de pagos realizados cada año.
      </Typography>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          El año final no puede ser menor al año inicial.
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default PagosAnualChart;