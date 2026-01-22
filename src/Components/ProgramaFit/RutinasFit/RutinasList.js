import { useState, useEffect, useCallback } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Pagination, Button, Typography, Dialog, DialogTitle,
    DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RutinasForm from "./RutinasForm";
import EmptyState from "../../../Shared/Components/EmptyState";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import ProgramaFitService from "../../../Services/ProgramaFitService";
import "../../../Components/TipoPago/Style.css";

const ITEMS_PER_PAGE = 5;

const EjercicioList = ({ programaId }) => {
    const [ejercicios, setEjercicios] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [anchorEl, setAnchorEl] = useState(null);
    const [rutina, setRutina] = useState({
        id: null,
        ejercicio: "",
        series: 1,
        repeticiones: 1,
        descanso: "00:30:00",
        demostracion: "",
    });
    const [loading, setLoading] = useState(false);

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedEjercicio, setSelectedEjercicio] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const loadEjercicios = useCallback(async (pageNumber = 1) => {
        try {
            const response = await ProgramaFitService.getRutinas(pageNumber, ITEMS_PER_PAGE);
            const { data, totalCount } = response;

            setEjercicios(data || []);
            setTotalPages(Math.ceil((totalCount || 0) / ITEMS_PER_PAGE));

            if (data.length === 0 && pageNumber > 1) {
                setPage(pageNumber - 1);
                loadEjercicios(pageNumber - 1);
            } else {
                setPage(pageNumber);
            }
            console.log("Ejercicios cargados:", data);
        } catch (error) {
            console.error("Error cargando ejercicios:", error);
            setEjercicios([]);
            setTotalPages(1);
            setPage(1);
        }
    }, []);

    useEffect(() => {
        loadEjercicios(page);
    }, [page, loadEjercicios]);
    
    const handleOpenForm = (event, ejercicio = null) => {
        setAnchorEl(event.currentTarget);
        setRutina(
            ejercicio || {
                id: null,
                ejercicio: "",
                series: 1,
                repeticiones: 1,
                descanso: "00:30:00",
                demostracion: "",
            }
        );
        setVideoFile(null);
    };

    const handleCloseForm = () => setAnchorEl(null);
    const handleChangeForm = (updatedData) => setRutina(updatedData);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!rutina.ejercicio) throw new Error("Debe ingresar el nombre del ejercicio");
            if (rutina.series < 1 || rutina.repeticiones < 1)
                throw new Error("Series y repeticiones deben ser mayores a 0");

            if (rutina.id) {
                console.log("Actualizando ejercicio:", rutina.id, ' datos recibidos par actualizar:', rutina, ' demostracion:', rutina.videoFile);
                await ProgramaFitService.putRutina(rutina.id, rutina, videoFile);
                console.log("Ejercicio actualizado:", rutina.id);
            } else {
                const { id, ...rutinaSinId } = rutina;
                await ProgramaFitService.postRutinas(rutinaSinId, videoFile);
            }

            loadEjercicios(page);
            handleCloseForm();
        } catch (error) {
            console.error("Error guardando ejercicio:", error.message || error);
            alert(error.message || "Error al guardar el ejercicio");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenConfirm = (ej) => {
        setSelectedEjercicio(ej);
        setOpenConfirm(true);
    };
    const handleCloseConfirm = () => {
        setSelectedEjercicio(null);
        setOpenConfirm(false);
    };

    const handleDelete = async () => {
        if (!selectedEjercicio) return;
        try {
            await ProgramaFitService.deleteRutina(selectedEjercicio.id);
            handleCloseConfirm();

            loadEjercicios(page);
        } catch (error) {
            console.error("Error eliminando ejercicio:", error);
            alert("No se pudo eliminar el ejercicio");
        }
    };
    function formatoDescanso(descanso) {
        const [horas, minutos, segundos] = descanso.split(':').map(Number);
        const partes = [];

        if (horas > 0) partes.push(`${horas}h`);
        if (minutos > 0) partes.push(`${minutos}min`);
        if (segundos > 0) partes.push(`${segundos}s`);

        return partes.join(' ') || '0s';
    }

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Ejercicios</Typography>
                <IconButton color="primary" onClick={(e) => handleOpenForm(e, null)}>
                    <AddIcon />
                </IconButton>
            </Box>

            {ejercicios.length === 0 ? (
                <EmptyState
                    title="Aún no hay ejercicios"
                    message="Cuando agregues ejercicios a este programa, aparecerán aquí."
                    Icon={FitnessCenterOutlinedIcon}
                />
            ) : (
                <List
                    dense
                    className="scroll-hide"
                    sx={{
                        minHeight: { xs: 0, md: 380 },
                        maxHeight: { xs: "auto", md: 380 },
                        overflow: "auto",
                    }}
                >
                    {ejercicios.map((ej) => (
                        <ListItem
                            key={ej.id}
                            sx={{
                                position: "relative",
                                mb: 1,
                                borderRadius: 1,
                                transition: "all 0.3s ease",
                                backgroundColor: "rgba(33,150,243,0.1)",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    "& .action-icons": { opacity: 1 },
                                },
                            }}
                        >
                            <ListItemText
                                primary={ej.ejercicio}
                                secondary={
                                    <>
                                        <div>{`Series: ${ej.series}, Repeticiones: ${ej.repeticiones}`}</div>
                                        <div>{`Descanso: ${formatoDescanso(ej.descanso)}`}</div>
                                    </>
                                }
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
                                <IconButton size="small" onClick={(e) => handleOpenForm(e, ej)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleOpenConfirm(ej)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={1}>
                    <Pagination
                        count={totalPages}
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
                        ¿Estás seguro que deseas eliminar el ejercicio{" "}
                        <strong>{selectedEjercicio?.Ejercicio}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Cancelar</Button>
                    <Button color="error" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            <RutinasForm
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                data={rutina}
                onChange={handleChangeForm}
                onClose={handleCloseForm}
                onSubmit={handleSubmitForm}
                loading={loading}
                videoFile={videoFile} setVideoFile={setVideoFile}
            />
        </>
    );
};
export default EjercicioList;