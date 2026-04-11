import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useTheme,
  Snackbar,
  Alert
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const rowsPerPageDefault = 5;

const PagosAnualTable = ({ pagosData }) => {
  const [page, setPage] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const dataNormalizada = useMemo(() => {
    if (!pagosData || pagosData.length === 0) {
      return [];
    }

    const sorted = [...pagosData].sort((a, b) => b.año - a.año);

    return sorted.map((item) => ({
      año: item.año,
      pagosRealizados: item.pagosRealizados ?? 0
    }));
  }, [pagosData]);

  // 🔹 Snackbar
  useEffect(() => {
    if (!pagosData || pagosData.length === 0) {
      setOpenSnackbar(true);
    }
  }, [pagosData]);

  // 🔹 Tendencia corregida (comparando con el siguiente año en la lista)
  const dataConTendencia = useMemo(() => {
    if (!dataNormalizada.length) return [];

    return dataNormalizada.map((item, index, array) => {
      const next = array[index + 1] || null;

      const trend = next
        ? item.pagosRealizados > next.pagosRealizados
          ? { Icon: TrendingUpIcon, color: "#43A047" }
          : item.pagosRealizados < next.pagosRealizados
            ? { Icon: TrendingDownIcon, color: "#E53935" }
            : { Icon: TrendingFlatIcon, color: "#757575" }
        : { Icon: TrendingFlatIcon, color: "#757575" };

      return { ...item, trend };
    });
  }, [dataNormalizada]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  return (
    <Box sx={{ width: "fit-content", ml: "auto" }}>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: isDarkMode ? theme.palette.background.default : "#fff",
          width: "fit-content",
          maxWidth: 400
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: isDarkMode ? "#333" : "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                  minWidth: 50
                }}
              >
                Año
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                  minWidth: 80
                }}
              >
                Pagos
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                  minWidth: 50
                }}
              >
                Tendencia
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataConTendencia.length > 0 ? (
              dataConTendencia
                .slice(
                  page * rowsPerPageDefault,
                  page * rowsPerPageDefault + rowsPerPageDefault
                )
                .map((item) => (
                  <TableRow
                    key={item.año}
                    sx={{
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#444" : "#f0f0f0"
                      }
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {item.año}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ color: item.trend.color }}
                    >
                      {item.pagosRealizados.toLocaleString()}
                    </TableCell>

                    <TableCell align="center">
                      <item.trend.Icon sx={{ color: item.trend.color }} />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  Aún no hay datos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {dataConTendencia.length > rowsPerPageDefault && (
          <TablePagination
            component="div"
            count={dataConTendencia.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPageDefault}
            rowsPerPageOptions={[]}
            sx={{
              "& .MuiTablePagination-toolbar": {
                justifyContent: "center"
              }
            }}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
          />
        )}
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          No se encontraron datos de pagos.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PagosAnualTable;