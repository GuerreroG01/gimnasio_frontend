import { Box, TextField, Button, Stack, Typography, CircularProgress, Popover, Paper, InputAdornment, Grid, MenuItem,
  Switch, FormControlLabel } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DescriptionIcon from "@mui/icons-material/Description";
import PaymentsIcon from "@mui/icons-material/Payments";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: theme => theme.palette.background.paper,
    height: 48,
    "&:hover fieldset": {
      borderColor: theme => theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderWidth: 2,
    },
  },
};

const TipoPagoForm = ({
  anchorEl,
  open,
  data,
  onChange,
  onClose,
  onSubmit,
  loading,
}) => {
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
          {data?.CodigoPago ? "Editar Tipo de Pago" : "Nuevo Tipo de Pago"}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Descripción"
                placeholder="Ej: Suscripción mensual"
                value={data?.Descripcion || ""}
                onChange={(e) =>
                  onChange({ ...data, Descripcion: e.target.value })
                }
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <DescriptionIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data?.Activo ?? true}
                    onChange={(e) =>
                      onChange({ ...data, Activo: e.target.checked })
                    }
                    color="success"
                    disabled={loading}
                  />
                }
                label={
                  <Typography fontWeight={500}>
                    {data?.Activo ? "Activo" : "Inactivo"}
                  </Typography>
                }
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Monto"
                value={data?.Monto ?? 0}
                onChange={(e) =>
                  onChange({ ...data, Monto: Number(e.target.value) })
                }
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  htmlInput: {
                    step: 10,
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Moneda"
                value={data?.Moneda || "NIO"}
                onChange={(e) =>
                  onChange({ ...data, Moneda: e.target.value })
                }
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PaymentsIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value="NIO">NIO</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={8}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Duración"
                value={data?.Duracion ?? 1}
                onChange={(e) =>
                  onChange({ ...data, Duracion: Number(e.target.value) })
                }
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Unidad"
                value={data?.UnidadTiempo || "Dias"}
                onChange={(e) =>
                  onChange({ ...data, UnidadTiempo: e.target.value })
                }
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScheduleIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                <MenuItem value="Dias">Días</MenuItem>
                <MenuItem value="Meses">Meses</MenuItem>
                <MenuItem value="Anio">Año</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
            <Button
              fullWidth
              onClick={onClose}
              disabled={loading}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {loading ? "Guardando..." : data?.CodigoPago ? "Actualizar" : "Guardar"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Popover>
  );
};
export default TipoPagoForm;