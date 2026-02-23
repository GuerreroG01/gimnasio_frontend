import { useState, useEffect, useCallback } from "react";
import { List, ListItem, ListItemText, IconButton, Box, Pagination, Button, Typography, Dialog, DialogTitle,
    DialogContent, DialogActions, useTheme, useMediaQuery, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";

import RutinasForm from "./RutinasForm";
import EmptyState from "../../../Shared/Components/EmptyState";
import ProgramaFitService from "../../../Services/ProgramaFitService";

const ITEMS_PER_PAGE = 5;

const EjercicioList = ({ open, onClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const isDark = theme.palette.mode === "dark";

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
    const [removeVideo, setRemoveVideo] = useState(false);

    const loadEjercicios = useCallback(
        async (pageNumber = 1) => {
            try {
                const response = await ProgramaFitService.getRutinas(pageNumber, ITEMS_PER_PAGE);

                const { data, totalCount } = response;

                setEjercicios(data || []);
                setTotalPages(Math.ceil((totalCount || 0) / ITEMS_PER_PAGE));
                setPage(pageNumber);
            } catch (error) {
                console.error("Error cargando ejercicios:", error);
                setEjercicios([]);
                setTotalPages(1);
                setPage(1);
            }
        },
        []
    );

    useEffect(() => {
        if (open) {
            loadEjercicios(1);
        }
    }, [open, loadEjercicios]);

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
        setRemoveVideo(false);
    };

    const handleCloseForm = () => setAnchorEl(null);
    const handleChangeForm = (updatedData) => setRutina(updatedData);

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!rutina.ejercicio)
                throw new Error("Debe ingresar el nombre del ejercicio");

            if (rutina.series < 1 || rutina.repeticiones < 1)
                throw new Error("Series y repeticiones deben ser mayores a 0");

            if (rutina.id) {
                await ProgramaFitService.putRutina(
                    rutina.id,
                    rutina,
                    videoFile,
                    removeVideo
                );
            } else {
                const { id, ...rutinaSinId } = rutina;
                await ProgramaFitService.postRutinas(rutinaSinId, videoFile);
            }

            await loadEjercicios(page);
            handleCloseForm();
        } catch (error) {
            alert(error.message || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenConfirm = (ej) => {
        setSelectedEjercicio(ej);
        setOpenConfirm(true);
    };

    const handleDelete = async () => {
        if (!selectedEjercicio) return;

        try {
            await ProgramaFitService.deleteRutina(selectedEjercicio.id);
            setOpenConfirm(false);
            await loadEjercicios(page);
        } catch {
            alert("No se pudo eliminar");
        }
    };

    const formatoDescanso = (descanso) => {
        const [h, m, s] = descanso.split(":").map(Number);
        const partes = [];
        if (h > 0) partes.push(`${h}h`);
        if (m > 0) partes.push(`${m}min`);
        if (s > 0) partes.push(`${s}s`);
        return partes.join(" ") || "0s";
    };

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
                        height: fullScreen ? "100%" : "85vh",
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
                        <FitnessCenterIcon color="primary" />
                        Administrar Rutinas
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            color="primary"
                            onClick={(e) => handleOpenForm(e, null)}
                        >
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
                        {ejercicios.length === 0 ? (
                            <EmptyState
                                title="Aún no hay ejercicios"
                                message="Cuando agregues ejercicios aparecerán aquí."
                                Icon={FitnessCenterOutlinedIcon}
                            />
                        ) : (
                            <List dense disablePadding>
                                {ejercicios.map((ej) => (
                                    <ListItem
                                        key={ej.id}
                                        sx={{
                                            mb: 2,
                                            borderRadius: 3,
                                            px: 2,
                                            py: 1.5,
                                            backgroundColor: isDark
                                                ? "rgba(255,255,255,0.05)"
                                                : "rgba(25,118,210,0.08)",
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
                                                    {ej.ejercicio}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    Series: {ej.series} | Reps:{" "}
                                                    {ej.repeticiones}
                                                    <br />
                                                    Descanso:{" "}
                                                    {formatoDescanso(
                                                        ej.descanso
                                                    )}
                                                </>
                                            }
                                        />

                                        <Box display="flex" gap={1}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) =>
                                                    handleOpenForm(e, ej)
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleOpenConfirm(ej)
                                                }
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>

                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => {
                                    setPage(value);
                                    loadEjercicios(value);
                                }}
                                size="small"
                                color="primary"
                            />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Eliminar el ejercicio{" "}
                        <strong>
                            {selectedEjercicio?.ejercicio}
                        </strong>
                        ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>
                        Cancelar
                    </Button>
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
                videoFile={videoFile}
                setVideoFile={setVideoFile}
                removeVideo={removeVideo}
                setRemoveVideo={setRemoveVideo}
            />
        </>
    );
};

export default EjercicioList;