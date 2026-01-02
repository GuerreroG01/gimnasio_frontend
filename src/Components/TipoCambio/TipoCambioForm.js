import { Box, TextField, Button, Stack, Typography, CircularProgress, Popover, Paper, InputAdornment, Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TodayIcon from "@mui/icons-material/Today";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "#fafafa",
    height: 48,
    "&:hover fieldset": {
      borderColor: "primary.main",
    },
    "&.Mui-focused fieldset": {
      borderWidth: 2,
    },
  },
};

const TipoCambioForm = ({ anchorEl, open, data, onChange, onClose, onSubmit, loading }) => {
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
            <Paper sx={{ p: 4, width: 460 }}>
                <Typography variant="h6" mb={3} fontWeight={600} textAlign="center">
                {data?.Id ? "Editar Tipo de Cambio" : "Nuevo Tipo de Cambio"}
                </Typography>

                <Box component="form" onSubmit={onSubmit}>
                <Grid container spacing={2.5}>
                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Moneda Origen"
                        placeholder="Ej: USD"
                        value={data?.monedaOrigen || ""}
                        onChange={(e) => onChange({ ...data, monedaOrigen: e.target.value.toUpperCase() })}
                        required
                        disabled={loading}
                        sx={fieldSx}
                        inputProps={{ maxLength: 3 }}
                    />
                    </Grid>

                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Moneda Destino"
                        placeholder="Ej: NIO"
                        value={data?.monedaDestino || ""}
                        onChange={(e) => onChange({ ...data, monedaDestino: e.target.value.toUpperCase() })}
                        required
                        disabled={loading}
                        sx={fieldSx}
                        inputProps={{ maxLength: 3 }}
                    />
                    </Grid>

                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Tasa"
                        value={data?.tasa ?? 1}
                        onChange={(e) => onChange({ ...data, tasa: Number(e.target.value) })}
                        required
                        disabled={loading}
                        sx={fieldSx}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <AttachMoneyIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        inputProps: { min: 0, step: 0.000001 },
                        }}
                    />
                    </Grid>

                    <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Fecha"
                        value={data?.Fecha ? data.Fecha.split("T")[0] : new Date().toISOString().split("T")[0]}
                        onChange={(e) => onChange({ ...data, fecha: e.target.value })}
                        required
                        disabled={loading}
                        sx={fieldSx}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <TodayIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        }}
                    />
                    </Grid>
                </Grid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
                    <Button fullWidth onClick={onClose} disabled={loading} variant="outlined" sx={{ textTransform: "none" }}>
                    Cancelar
                    </Button>
                    <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                    >
                    {loading ? "Guardando..." : data?.id ? "Actualizar" : "Guardar"}
                    </Button>
                </Stack>
                </Box>
            </Paper>
        </Popover>
    );
};

export default TipoCambioForm;