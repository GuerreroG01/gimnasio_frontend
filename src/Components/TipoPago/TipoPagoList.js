import React,{ useEffect } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Pagination, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, useTheme, useMediaQuery} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import tipo_PagosService from "../../Services/Tipo_PagosService";
import TipoPagoForm from "./TipoPagoForm";
import EmptyState from "../../Shared/Components/EmptyState";
import CustomSnackbar from "../../Shared/Components/CustomSnackbar";

const ITEMS_PER_PAGE = 4;

const TipoPagoListDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const [tipoPagos, setTipoPagos] = React.useState([]);
  const [page, setPage] = React.useState(1);

  const [editPago, setEditPago] = React.useState({
    CodigoPago: null,
    Descripcion: "",
    Monto: 0,
    Duracion: 1,
    UnidadTiempo: "Dias",
    Alimentacion: false,
    Rutinas: false,
    Moneda: "NIO",
    Activo: true,
  });

  const [loading, setLoading] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [selectedPago, setSelectedPago] = React.useState(null);
  const [openForm, setOpenForm] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'warning'
  });

  const showSnackbar = (message, severity = 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (open) loadTipoPagos();
  }, [open]);

  const loadTipoPagos = () => {
    tipo_PagosService
      .getTipoPagos()
      .then(setTipoPagos)
      .catch(console.error);
  };

  const handleOpenForm = (tp = null) => {
    setEditPago(
      tp
        ? {
            CodigoPago: tp.codigoPago,
            Descripcion: tp.descripcion,
            Monto: tp.monto,
            Duracion: tp.duracion,
            UnidadTiempo: tp.unidadTiempo,
            Alimentacion: tp.alimentacion,
            Rutinas: tp.rutinas,
            Moneda: tp.moneda,
            Activo: tp.activo ?? true,
          }
        : {
            CodigoPago: null,
            Descripcion: "",
            Monto: 0,
            Duracion: 1,
            UnidadTiempo: "Dias",
            Alimentacion: false,
            Rutinas: false,
            Moneda: "NIO",
            Activo: true,
          }
    );
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);
  const handleChangeForm = (updatedData) => setEditPago(updatedData);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editPago.Monto <= 0) throw new Error("El monto debe ser mayor que 0");
      if (editPago.Duracion < 1)
        throw new Error("La duración debe ser al menos 1");

      if (editPago.CodigoPago) {
        await tipo_PagosService.updateTipoPago(editPago.CodigoPago, editPago);
      } else {
        const { CodigoPago, ...nuevoPago } = editPago;
        await tipo_PagosService.createTipoPago(nuevoPago);
      }

      loadTipoPagos();
      handleCloseForm();
    } catch (error) {
      alert(error.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirm = (tp) => {
    setSelectedPago(tp);
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setSelectedPago(null);
    setOpenConfirm(false);
  };
  const handleDelete = async () => {
    if (!selectedPago) return;

    try {
      await tipo_PagosService.deleteTipoPago(selectedPago.codigoPago);

      setTipoPagos((prev) =>
        prev.filter((tp) => tp.codigoPago !== selectedPago.codigoPago)
      );

      handleCloseConfirm();

      showSnackbar('Tipo de pago eliminado correctamente', 'success');

    } catch (error) {
      const backendMessage =
        error.response?.data?.mensaje || 'Error eliminando tipo de pago';

      showSnackbar(backendMessage, 'error');
    }
  };

  const paginatedItems = tipoPagos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 4,
            height: fullScreen ? "100%" : "80vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 600,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <PaymentsOutlinedIcon color="primary" />
            Tipos de Pago
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="primary" onClick={() => handleOpenForm(null)}>
              <AddIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            p: 3,
          }}
        >
          <Divider sx={{ mb: 1 }} />
          <Box
            className="scroll-hide"
            sx={{
              flex: 1,
              pr: 1,
            }}
          >
            {tipoPagos.length === 0 ? (
              <EmptyState
                title="Aún no hay planes de membresía"
                message="Cuando agregues planes semanales, mensuales o anuales, aparecerán aquí."
                Icon={PaymentsOutlinedIcon}
              />
            ) : (
              <List dense disablePadding>
                {paginatedItems.map((tp) => (
                  <ListItem
                    key={tp.codigoPago}
                    sx={{
                      mb: 2,
                      borderRadius: 3,
                      px: 2,
                      py: 1.5,
                      backgroundColor:
                        tp.activo === 1 || tp.activo === true
                          ? "rgba(76, 175, 80, 0.15)"
                          : "rgba(244, 67, 54, 0.15)",
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all .2s ease",
                      "&:hover": {
                        boxShadow: isDark
                          ? "0 4px 16px rgba(0,0,0,0.6)"
                          : "0 4px 16px rgba(0,0,0,0.1)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>
                          {tp.descripcion}
                        </Typography>
                      }
                      secondary={`Monto: ${tp.monto} ${tp.moneda} | Duración: ${tp.duracion} ${tp.unidadTiempo}`}
                    />
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleOpenForm(tp)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenConfirm(tp)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {tipoPagos.length > ITEMS_PER_PAGE && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(tipoPagos.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={(e, value) => setPage(value)}
                size="small"
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmación eliminación */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Eliminar el tipo de pago <strong>{selectedPago?.descripcion}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          autoHideDuration={4000}
        />
      </Dialog>

      {/* Formulario */}
      <TipoPagoForm
        open={openForm}
        data={editPago}
        onChange={handleChangeForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        loading={loading}
      />
    </>
  );
};

export default TipoPagoListDialog;