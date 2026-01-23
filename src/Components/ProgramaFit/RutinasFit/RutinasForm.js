import { Box, TextField, IconButton, Button,Tooltip, Stack, Typography, CircularProgress, Popover, Paper, InputAdornment, Grid } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RepeatIcon from "@mui/icons-material/Repeat";
import TimerIcon from "@mui/icons-material/Timer";
import MovieIcon from "@mui/icons-material/Movie";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

const fieldSx = {
    "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: paper => paper.palette.mode === "light" ? "#F9FAFB" : paper.palette.background.default,
            height: 48,
            "&:hover fieldset": {
            borderColor: "primary.main",
        },
            "&.Mui-focused fieldset": {
            borderWidth: 2,
        },
    },
};

const RutinasForm = ({ anchorEl, open, data, onChange, onClose, onSubmit, loading, videoFile, setVideoFile, removeVideo, setRemoveVideo }) => {
    const API_DEMOSTRACIONES = (window._env_ ? window._env_.REACT_APP_VIDEODEMOSTRACION_URL : process.env.REACT_APP_VIDEODEMOSTRACION_URL);
    const demostracion = data.demostracion ? `${API_DEMOSTRACIONES}/${data.demostracion}` : null;
    const isString = typeof demostracion === "string";
    const isGif = isString && demostracion.toLowerCase().endsWith(".gif");

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            slotProps={{
                paper: {
                sx: {
                    borderRadius: 3,
                    boxShadow: "0px 12px 32px rgba(0,0,0,0.15)",
                },
                },
            }}
            >
            <Paper sx={{ p: 4, width: 400 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant="h6" fontWeight={600}>
                    {data?.id ? "Editar Ejercicio" : "Nuevo Ejercicio"}
                    </Typography>

                    <IconButton onClick={onClose} disabled={loading} size="small" >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box component="form" onSubmit={onSubmit}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Nombre del Ejercicio"
                                placeholder="Ej: Sentadillas"
                                value={data?.ejercicio || ""}
                                onChange={(e) =>
                                    onChange({ ...data, ejercicio: e.target.value })
                                }
                                required
                                disabled={loading}
                                sx={fieldSx}
                                slotProps={{
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <FitnessCenterIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Series"
                                value={data?.series ?? 1}
                                onChange={(e) =>
                                    onChange({ ...data, series: Number(e.target.value) })
                                }
                                required
                                disabled={loading}
                                sx={fieldSx}
                                slotProps={{
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <RepeatIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    },
                                    htmlInput: {
                                    min: 1,
                                    max: 50,
                                    },
                                }}
                                />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Repeticiones"
                                value={data?.repeticiones ?? 1}
                                onChange={(e) =>
                                    onChange({ ...data, repeticiones: Number(e.target.value) })
                                }
                                required
                                disabled={loading}
                                sx={fieldSx}
                                slotProps={{
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <RepeatIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    },
                                    htmlInput: {
                                    min: 1,
                                    max: 100,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                type="time"
                                label="Descanso"
                                value={data?.descanso ?? "00:30:00"}
                                onChange={(e) =>
                                    onChange({ ...data, descanso: e.target.value })
                                }
                                required
                                disabled={loading}
                                sx={fieldSx}
                                slotProps={{
                                    inputLabel: {
                                    shrink: true,
                                    },
                                    input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <TimerIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    },
                                    htmlInput: {
                                    step: 1,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Tooltip
                                        title={
                                            videoFile
                                                ? "Reemplazar video"
                                                : data?.demostracion
                                                ? "Reemplazar video"
                                                : "Agregar video"
                                        }
                                    >
                                        <Box sx={{ position: "relative", width: 40, height: 40 }}>
                                            {(videoFile || (data?.demostracion && !removeVideo)) ? (
                                                <FindReplaceIcon
                                                    onClick={() => document.getElementById("video-input").click()}
                                                    sx={{
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        color: loading ? "text.disabled" : "primary.main",
                                                        fontSize: 40,
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                    }}
                                                />
                                            ) : (
                                                <MovieIcon
                                                    onClick={() => document.getElementById("video-input").click()}
                                                    sx={{
                                                        cursor: loading ? "not-allowed" : "pointer",
                                                        color: loading ? "text.disabled" : "primary.main",
                                                        fontSize: 40,
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                    }}
                                                />
                                            )}

                                            {loading && (
                                                <CircularProgress
                                                    size={40}
                                                    sx={{
                                                        color: "primary.main",
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        zIndex: 1,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Tooltip>
                                    <Typography variant="body2">
                                        <strong>
                                            {removeVideo
                                                ? "Video eliminado"
                                                : videoFile
                                                ? videoFile.name
                                                : data?.demostracion ?? ""}
                                        </strong>
                                    </Typography>
                                    {(videoFile || data?.demostracion) && (
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={loading}
                                            onClick={() => {
                                                setVideoFile(null);
                                                setRemoveVideo(true);

                                                const input = document.getElementById("video-input");
                                                if (input) input.value = "";
                                            }}
                                        >
                                            <RemoveIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                                <input
                                    id="video-input"
                                    type="file"
                                    accept="video/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                    const file = e.target.files[0];
                                        setVideoFile(file || null);
                                        setRemoveVideo(false);
                                    }}
                                />
                            </Box>
                            {isString && (
                                <Box mt={2}>
                                    <Typography variant="subtitle2" mb={1} fontWeight={600}>
                                        Video guardado
                                    </Typography>

                                    <Box
                                        sx={{
                                            width: 400,
                                            height: 180,
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                            backgroundColor: "#000",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mt: 1,
                                        }}
                                    >
                                        {isGif ? (
                                            <img
                                            src={demostracion}
                                            alt="Demostración"
                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            />
                                        ) : (
                                            <video
                                            src={demostracion}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            sx={{ textTransform: "none", fontWeight: 500 }}
                        >
                            {loading ? "Guardando..." : data?.Id ? "Actualizar" : "Guardar"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Popover>
    );
};
export default RutinasForm;