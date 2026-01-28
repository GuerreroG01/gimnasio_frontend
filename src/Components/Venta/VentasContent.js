import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VentaService from "../../Services/VentaService";
import { CircularProgress, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Box, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Snackbar,
  Alert, useMediaQuery, DialogContentText, Tooltip, Pagination, useTheme } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { convertirPrecio, obtenerSimboloMoneda } from "../../Utils/MonedaUtils";

const ITEMS_PER_PAGE = 10;

const VentasContent = ({ selectedFecha, fechaLimite, tipoCambio }) => {
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(min-width:601px) and (max-width:960px)");
  const isLargeScreen = !isSmallScreen && !isMediumScreen;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoadingVentas(true);
        const response = await VentaService.GetVentasPorFecha(selectedFecha, fechaLimite || null);
        setVentas(response);
        setPage(1);
        setSelectedRow(null);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
        setVentas([]);
      } finally {
        setLoadingVentas(false);
      }
    };

    if (selectedFecha) fetchVentas();
  }, [selectedFecha, fechaLimite]);

  const formatDate = (date) => {
    if (!date) return "No proporcionado";
    const zonedDate = toZonedTime(new Date(date), "America/Managua");
    return format(zonedDate, "dd MMM yyyy", { locale: es });
  };

  const handleEditVenta = (codigo_venta) =>
    navigate(`/venta/${codigo_venta}/update`);

  const handleDeleteVenta = async () => {
    if (!ventaToDelete) return;

    try {
      await VentaService.DeleteVenta(ventaToDelete.codigo_venta);

      setVentas(prev => {
        const updated = prev.filter(v => v.codigo_venta !== ventaToDelete.codigo_venta);
        const totalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (page > totalPages && totalPages > 0) setPage(totalPages);
        return updated;
      });

      setSnackbar({ open: true, message: "Venta eliminada correctamente.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar la venta.", severity: "error" });
    } finally {
      setDeleteDialog(false);
      setVentaToDelete(null);
      setSelectedRow(null);
    }
  };

  const renderProductosTooltip = (venta) =>
    venta.ventaProducto?.length
      ? venta.ventaProducto.map(vp => `${vp.producto.descripcion} x ${vp.cantidad}`).join("\n")
      : "Sin productos";

  const totalPages = Math.ceil(ventas.length / ITEMS_PER_PAGE);
  const ventasPaginate = ventas.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Card sx={{ mt: 2, p: 3, boxShadow: 4, borderRadius: 3 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <CalendarMonthIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
          </Grid>
          <Grid item>
            <Typography variant="h6" fontWeight="bold">
              {fechaLimite
                ? `Ventas del ${formatDate(selectedFecha)} al ${formatDate(fechaLimite)}`
                : `Ventas del ${formatDate(selectedFecha)}`}
            </Typography>
          </Grid>
        </Grid>

        {loadingVentas ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress size={50} />
          </Box>
        ) : ventas.length === 0 ? (
          <Typography align="center">No hay ventas.</Typography>
        ) : isLargeScreen ? (
          <Box sx={{ position: "relative" }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#1565C0" }}>
                    {["Código", "Fecha", "Vendedor", "Total", "Artículos", "Moneda"].map(h => (
                      <TableCell key={h} align="center" sx={{ fontWeight: "bold",   bgcolor: theme.palette.mode === "dark" ? "#022e70" : theme.palette.primary.main, color: "white" }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ventasPaginate.map(venta => {
                    const total = convertirPrecio(
                      venta.total,
                      venta.moneda,
                      venta.moneda,
                      tipoCambio
                    );
                    const simbolo = obtenerSimboloMoneda(venta.moneda);

                    return (
                      <TableRow
                        key={venta.codigo_venta}
                        hover
                        onClick={() => setSelectedRow(venta.codigo_venta)}
                        sx={{
                          cursor: "pointer",
                          bgcolor: selectedRow === venta.codigo_venta
                            ? (theme.palette.mode === "light" 
                                ? "rgba(25, 118, 210, 0.31)"
                                : theme.palette.action.selected)
                            : "inherit",
                        }}
                      >
                        <TableCell align="center">{venta.codigo_venta}</TableCell>
                        <TableCell align="center">{formatDate(venta.fecha_venta)}</TableCell>
                        <TableCell align="center">{venta.nombre_vendedor}</TableCell>
                        <TableCell align="center">{simbolo}{total.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Tooltip title={<span style={{ whiteSpace: "pre-line" }}>{renderProductosTooltip(venta)}</span>} arrow>
                            <Box display="inline-flex" alignItems="center">
                              <ShoppingCartIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                              {venta.ventaProducto?.length || 0}
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">{venta.moneda}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                position: "fixed",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                bgcolor: theme.palette.background.paper,
                boxShadow: 3,
                borderRadius: 2,
                p: 2,
                zIndex: 1000
              }}
            >
              <IconButton
                color="success"
                onClick={() => navigate("/venta/new")}
              >
                <AddIcon />
              </IconButton>
              <IconButton color="primary" disabled={!selectedRow} onClick={() => handleEditVenta(selectedRow)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                disabled={!selectedRow}
                onClick={() => {
                  setVentaToDelete(ventas.find(v => v.codigo_venta === selectedRow));
                  setDeleteDialog(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {ventas.length > ITEMS_PER_PAGE && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  shape="rounded"
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </Box>
        ) : (
          <>
            <Box display="flex" flexDirection="column" gap={2}>
              {ventasPaginate.map(venta => {
                const total = convertirPrecio(
                  venta.total,
                  venta.moneda,
                  venta.moneda,
                  tipoCambio
                );
                const simbolo = obtenerSimboloMoneda(venta.moneda);

                return (
                  <Card key={venta.codigo_venta} sx={{ p: 2 }}>
                    <Typography fontWeight="bold">Código: {venta.codigo_venta}</Typography>
                    <Typography>{formatDate(venta.fecha_venta)}</Typography>
                    <Typography>{venta.nombre_vendedor}</Typography>
                    <Typography>{simbolo}{total.toFixed(2)}</Typography>
                    <Typography>Moneda: {venta.moneda}</Typography>

                    <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                      <IconButton color="primary" onClick={() => handleEditVenta(venta.codigo_venta)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setVentaToDelete(venta);
                          setDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {ventas.length > ITEMS_PER_PAGE && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  shape="rounded"
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </CardContent>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta venta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDeleteVenta}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Card>
  );
};
export default VentasContent;