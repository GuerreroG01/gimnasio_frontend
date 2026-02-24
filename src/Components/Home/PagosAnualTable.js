import React, { useEffect, useState } from "react";
import PagoService from "../../Services/PagoService";
import { CircularProgress, Box, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, useTheme } from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const PagosAnualTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await PagoService.getAñosConPagos();
        const sortedData = response.sort((a, b) => b.año - a.año);

        // Agregar tendencias
        const datosConTendencia = sortedData.map((item, index, array) => {
          const prev = array[index - 1] || null;
          const trend = prev
            ? item.pagosRealizados > prev.pagosRealizados
              ? { Icon: TrendingUpIcon, color: "#43A047" }
              : item.pagosRealizados < prev.pagosRealizados
                ? { Icon: TrendingDownIcon, color: "#E53935" }
                : { Icon: TrendingFlatIcon, color: "#757575" }
            : { Icon: TrendingFlatIcon, color: "#757575" };
          return { ...item, trend };
        });

        setData(datosConTendencia);
      } catch (err) {
        console.error("Error al obtener datos de pagos:", err);
        setOpenSnackbar(true);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (!data.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "fit-content", ml: "auto" }}>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: isDarkMode ? theme.palette.background.default : "#fff",
          width: "fit-content",
          maxWidth: 400,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: isDarkMode ? "#333" : "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000", minWidth: 50 }}>Año</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000", minWidth: 80 }}>Pagos</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000", minWidth: 50 }}>Tendencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow
                key={item.año}
                sx={{
                  "&:hover": { backgroundColor: isDarkMode ? "#444" : "#f0f0f0" },
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>{item.año}</TableCell>
                <TableCell align="right" sx={{ color: item.trend.color }}>
                  {item.pagosRealizados.toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <item.trend.Icon sx={{ color: item.trend.color }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            sx={{ "& .MuiTablePagination-toolbar": { justifyContent: "center" } }}
          />
        )}
      </TableContainer>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          Error al cargar los datos.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PagosAnualTable;