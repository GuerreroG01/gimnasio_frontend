import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Pagination, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import tipo_PagosService from "../../Services/Tipo_PagosService";
import TipoPagoForm from "./TipoPagoForm";
import "../../Components/TipoPago/Style.css";
import EmptyState from '../../Shared/Components/EmptyState';
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

const ITEMS_PER_PAGE = 4;

const TipoPagoList = () => {
  const [tipoPagos, setTipoPagos] = useState([]);
  const [page, setPage] = useState(1);

  const [anchorEl, setAnchorEl] = useState(null);
  const [editPago, setEditPago] = useState({
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
  const [loading, setLoading] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);

  useEffect(() => {
    loadTipoPagos();
  }, []);

  const loadTipoPagos = () => {
    tipo_PagosService.getTipoPagos().then(setTipoPagos).catch(console.error);
  };

  const handleOpenForm = (event, tp = null) => {
    setAnchorEl(event.currentTarget);
    setEditPago(tp ? {
      CodigoPago: tp.codigoPago,
      Descripcion: tp.descripcion,
      Monto: tp.monto,
      Duracion: tp.duracion,
      UnidadTiempo: tp.unidadTiempo,
      Alimentacion: tp.alimentacion,
      Rutinas: tp.rutinas,
      Moneda: tp.moneda,
      Activo: tp.activo ?? true,
    } : {
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
  };

  const handleCloseForm = () => {
    setAnchorEl(null);
  };

  const handleChangeForm = (updatedData) => setEditPago(updatedData);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editPago.Monto <= 0) throw new Error("El monto debe ser mayor que 0");
      if (editPago.Duracion < 1) throw new Error("La duración debe ser al menos 1");

      if (editPago.CodigoPago) {
        await tipo_PagosService.updateTipoPago(editPago.CodigoPago, editPago);
      } else {
        const { CodigoPago, ...nuevoPago } = editPago;
        await tipo_PagosService.createTipoPago(nuevoPago);
      }

      loadTipoPagos();
      handleCloseForm();
    } catch (error) {
      console.error("Error guardando tipo de pago:", error.message || error);
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
    } catch (error) {
      console.error("Error eliminando tipo de pago:", error);
    }
  };

  const paginatedItems = tipoPagos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tipos de Pago</Typography>
        <IconButton color="primary" onClick={(e) => handleOpenForm(e, null)}>
          <AddIcon />
        </IconButton>
      </Box>

      {tipoPagos.length === 0 ? (
        <EmptyState
          title="Aún no hay planes de membresía"
          message="Cuando agregues planes semanales, mensuales o anuales, aparecerán aquí para que los puedas gestionar."
          Icon={PaymentsOutlinedIcon}
        />
      ) : (
        <List
          dense
          className="scroll-hide"
          sx={{
            minHeight: { xs: 0, md: 260 },
            maxHeight: { xs: "auto", md: 260 },
            overflow: "auto",
          }}
        >
          {paginatedItems.map((tp) => (
            <ListItem
              key={tp.codigoPago}
              sx={{
                position: "relative",
                mb: 1,
                borderRadius: 1,
                transition: "all 0.3s ease",
                backgroundColor:
                  tp.activo === 1 || tp.activo === true
                    ? "rgba(76, 175, 80, 0.15)"
                    : "rgba(244, 67, 54, 0.15)",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "& .action-icons": { opacity: 1 },
                },
              }}
            >
              <ListItemText
                primary={tp.descripcion}
                secondary={`Monto: ${tp.monto} ${tp.moneda}, Duración: ${tp.duracion} ${tp.unidadTiempo}`}
              />
              <Box
                className="action-icons"
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  display: "flex",
                  gap: 0.5,
                }}
              >
                <IconButton size="small" onClick={(e) => handleOpenForm(e, tp)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpenConfirm(tp)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {tipoPagos.length > ITEMS_PER_PAGE && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Pagination
            count={Math.ceil(tipoPagos.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={(e, value) => setPage(value)}
            size="small"
          />
        </Box>
      )}

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el tipo de pago{" "}
            <strong>{selectedPago?.descripcion}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <TipoPagoForm
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        data={editPago}
        onChange={handleChangeForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        loading={loading}
      />
    </>
  );
};
export default TipoPagoList;