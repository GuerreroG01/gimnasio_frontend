import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Pagination, Button, Typography, Dialog, DialogTitle, DialogContent,
    DialogActions} from "@mui/material";
//import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
//import DeleteIcon from "@mui/icons-material/Delete";
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import tipoCambioService from "../../Services/TipoCambioService";
import TipoCambioForm from "./TipoCambioForm";
import "../../Components/TipoPago/Style.css";

const ITEMS_PER_PAGE = 4;

const TipoCambioList = () => {
    const [tipoCambios, setTipoCambios] = useState([]);
    const [page, setPage] = useState(1);

    const [anchorEl, setAnchorEl] = useState(null);
    const [editCambio, setEditCambio] = useState({
        id: null,
        monedaOrigen: "",
        monedaDestino: "",
        tasa: 1,
        fecha: new Date().toISOString().split("T")[0],
    });
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedCambio, setSelectedCambio] = useState(null);

    useEffect(() => {
        loadTipoCambios();
    }, []);

    const loadTipoCambios = () => {
        tipoCambioService
        .getTipoCambios()
        .then(setTipoCambios)
        .catch(console.error);
    };

    const handleOpenForm = (event, tc = null) => {
        setAnchorEl(event.currentTarget);
        setEditCambio(
        tc
            ? { ...tc }
            : {
                id: null,
                monedaOrigen: "",
                monedaDestino: "",
                tasa: 1,
                fecha: new Date().toISOString().split("T")[0],
            }
        );
    };

    const handleCloseForm = () => {
        setAnchorEl(null);
    };

    const handleChangeForm = (updatedData) => setEditCambio(updatedData);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        if (editCambio.tasa <= 0) throw new Error("La tasa debe ser mayor que 0");

        if (editCambio.id) {
            await tipoCambioService.updateTipoPago(editCambio.id, editCambio);
        } else {
            const { id, ...nuevoCambio } = editCambio;
            await tipoCambioService.createTipoCambio(nuevoCambio);
        }

        loadTipoCambios();
        handleCloseForm();
        } catch (error) {
        console.error("Error guardando tipo de cambio:", error.message || error);
        alert(error.message || "Error al guardar");
        } finally {
        setLoading(false);
        }
    };

    /*const handleOpenConfirm = (tc) => {
        setSelectedCambio(tc);
        setOpenConfirm(true);
    };*/
    const handleCloseConfirm = () => {
        setSelectedCambio(null);
        setOpenConfirm(false);
    };
    const handleDelete = async () => {
        if (!selectedCambio) return;
        try {
        await tipoCambioService.deleteTipoCambio(selectedCambio.id);
        setTipoCambios((prev) =>
            prev.filter((tc) => tc.id !== selectedCambio.id)
        );
        handleCloseConfirm();
        } catch (error) {
        console.error("Error eliminando tipo de cambio:", error);
        }
    };

    const paginatedItems = tipoCambios.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Tipos de Cambio</Typography>
            {/*<IconButton color="primary" onClick={(e) => handleOpenForm(e, null)}>
                <AddIcon />
            </IconButton>*/}
        </Box>

        <List
            dense
            className="scroll-hide"
            sx={{ minHeight: { xs: 0, md: 130 }, maxHeight: { xs: "auto", md: 130 }, overflow: "auto" }}
        >
            {paginatedItems.map((tc) => (
            <ListItem
                key={tc.id}
                sx={{
                position: "relative",
                mb: 1,
                borderRadius: 1,
                transition: "all 0.3s ease",
                backgroundColor: "rgba(33, 150, 243, 0.15)",
                "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    "& .action-icons": { opacity: 1 },
                },
                }}
            >
                <ListItemText
                    primary={
                        <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body1" fontWeight={500}>
                            {tc.monedaOrigen}
                        </Typography>
                        <DoubleArrowIcon fontSize="small" />
                        <Typography variant="body1" fontWeight={500}>
                            {tc.monedaDestino}
                        </Typography>
                        </Box>
                    }
                    secondary={`Tasa: ${tc.tasa}, Fecha: ${new Date(tc.fecha).toLocaleDateString()}`}
                />
                <Box
                    className="action-icons"
                sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    display: "flex",
                    gap: 0.5,
                }}
                >
                <IconButton size="small" onClick={(e) => handleOpenForm(e, tc)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                {/*<IconButton size="small" onClick={() => handleOpenConfirm(tc)}>
                    <DeleteIcon fontSize="small" />
                </IconButton>*/}
                </Box>
            </ListItem>
            ))}
        </List>

        {tipoCambios.length > ITEMS_PER_PAGE && (
            <Box display="flex" justifyContent="center" mt={1}>
            <Pagination
                count={Math.ceil(tipoCambios.length / ITEMS_PER_PAGE)}
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
                ¿Estás seguro que deseas eliminar el tipo de cambio{" "}
                <strong>{selectedCambio?.monedaOrigen} → {selectedCambio?.monedaDestino}</strong>?
            </Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancelar</Button>
            <Button color="error" onClick={handleDelete}>
                Eliminar
            </Button>
            </DialogActions>
        </Dialog>

        <TipoCambioForm
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            data={editCambio}
            onChange={handleChangeForm}
            onClose={handleCloseForm}
            onSubmit={handleSubmitForm}
            loading={loading}
        />
        </>
    );
};

export default TipoCambioList;