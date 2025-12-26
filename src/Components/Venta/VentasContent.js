import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VentaService from "../../Services/VentaService";
import ProductoService from "../../Services/ProductoService";
import { CircularProgress, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, Snackbar, Alert, useMediaQuery, DialogContentText } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const VentasContent = ({ selectedFecha, fechaLimite }) => {
  console.log('Fecha obtenida en VentasContent:', selectedFecha, fechaLimite);
  const [ventas, setVentas] = useState([]);
  const [loadingVentas, setLoadingVentas] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [ventaToDelete, setVentaToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(min-width:601px) and (max-width:960px)");
  const isLargeScreen = !isSmallScreen && !isMediumScreen;

  useEffect(() => {
    const fetchVentas = async () => {
      setLoadingVentas(true);
      try {
        const response = await VentaService.GetVentasPorFecha(selectedFecha, fechaLimite || null);
        const ventasConDescripcion = await Promise.all(
          response.map(async (venta) => {
            if (venta.codigoProducto) {
              try {
                const producto = await ProductoService.getProductoById(venta.codigoProducto);
                return { ...venta, descripcionProducto: producto.descripcion };
              } catch (error) {
                return { ...venta, descripcionProducto: "Producto no encontrado" };
              }
            }
            return { ...venta, descripcionProducto: "Sin Producto" };
          })
        );
        setVentas(ventasConDescripcion);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
        setVentas([]);
      } finally {
        setLoadingVentas(false);
      }
    };
  
    if (selectedFecha) {
      fetchVentas();
    }
  }, [selectedFecha, fechaLimite]);  

  const formatDate = (date) => {
    if (!date) return "No proporcionado";
    const zonedDate = toZonedTime(new Date(date), "America/Managua");
    return format(zonedDate, "dd MMM yyyy", { locale: es });
  };

  const handleEditVenta = (codigo_venta) => {
    navigate(`/venta/${codigo_venta}/update`);
  };

  const handleDeleteVenta = async () => {
    if (ventaToDelete) {
      try {
        await VentaService.DeleteVenta(ventaToDelete.codigo_venta);
        setVentas((prevVentas) => prevVentas.filter((venta) => venta.codigo_venta !== ventaToDelete.codigo_venta));
        setSnackbar({ open: true, message: "Venta eliminada correctamente.", severity: "success" });
      } catch (error) {
        setSnackbar({ open: true, message: "Error al eliminar la venta.", severity: "error" });
      } finally {
        setDeleteDialog(false);
        setVentaToDelete(null);
      }
    }
  };

  return (
    <Card sx={{ mt: 2, p: 3, boxShadow: 4, borderRadius: 3, backgroundColor: "white" }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <CalendarMonthIcon sx={{ fontSize: { xs: 24, sm: 32 }, color: "#1565C0" }} />
          </Grid>
          <Grid item>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
              {fechaLimite
                ? `Ventas del ${formatDate(selectedFecha)} al ${formatDate(fechaLimite)}`
                : `Ventas del ${formatDate(selectedFecha)}`}
            </Typography>
          </Grid>
        </Grid>

        {loadingVentas ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress color="primary" size={50} />
          </Box>
        ) : ventas.length > 0 ? (
          isLargeScreen ? (
            <Box sx={{ position: "relative" }}>
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#1565C0" }}>
                      {["Código", "Fecha", "Vendedor", "Total", "Artículos", "Producto"].map((header, index) => (
                        <TableCell key={index} sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventas.map((venta) => (
                      <TableRow
                        key={venta.codigo_venta}
                        onClick={() => setSelectedRow(venta.codigo_venta)}
                        className="venta-row"
                        sx={{
                          bgcolor: selectedRow === venta.codigo_venta ? "#BBDEFB" : "white",
                          "&:hover": { bgcolor: selectedRow === venta.codigo_venta ? "#90CAF9" : "#E3F2FD" },
                          cursor: "pointer",
                          transition: "background-color 0.3s ease-in-out",
                        }}
                      >
                        <TableCell align="center">{venta.codigo_venta}</TableCell>
                        <TableCell align="center"><CalendarMonthIcon sx={{ mr: 1 }} />{formatDate(venta.fecha_venta)}</TableCell>
                        <TableCell align="center"><PersonIcon sx={{ mr: 1 }} />{venta.nombre_vendedor}</TableCell>
                        <TableCell align="center"><AttachMoneyIcon sx={{ mr: 1, color: "green" }} />{venta.total}</TableCell>
                        <TableCell align="center"><ShoppingCartIcon sx={{ mr: 1, color: "#FFA000" }} />{venta.art_vendidos}</TableCell>
                        <TableCell align="center">{venta.descripcionProducto || "Sin Producto"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                className="acciones-venta"
                sx={{
                  position: "fixed",
                  right: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  bgcolor: "white",
                  boxShadow: 3,
                  borderRadius: 2,
                  p: 2,
                  zIndex: 1000,
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => selectedRow && handleEditVenta(selectedRow)}
                  disabled={!selectedRow}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    if (selectedRow) {
                      setVentaToDelete(ventas.find((v) => v.codigo_venta === selectedRow));
                      setDeleteDialog(true);
                    }
                  }}
                  disabled={!selectedRow}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {ventas.map((venta) => (
                <Card key={venta.codigo_venta} sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
                  <Typography variant="h6">Código: {venta.codigo_venta}</Typography>
                  <Typography><CalendarMonthIcon /> {formatDate(venta.fecha_venta)}</Typography>
                  <Typography><PersonIcon /> {venta.nombre_vendedor}</Typography>
                  <Typography><AttachMoneyIcon sx={{ color: "green" }} /> {venta.total}</Typography>
                  <Typography><ShoppingCartIcon sx={{ color: "#FFA000" }} /> {venta.art_vendidos}</Typography>
                  <Typography><LocalOfferIcon sx={{ color: "#FFA000" }} /> {venta.descripcionProducto || "Sin Producto"}</Typography>
                  <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                    <IconButton color="primary" onClick={() => handleEditVenta(venta.codigo_venta)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => { setVentaToDelete(venta); setDeleteDialog(true); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Box>
          )
        ) : (
          <Typography align="center">📉 No hay ventas.</Typography>
        )}
      </CardContent>
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar esta venta? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} color="primary">Cancelar</Button>
          <Button onClick={handleDeleteVenta} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};
export default VentasContent;