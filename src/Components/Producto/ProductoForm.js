import { Box, TextField, Button, Stack, Typography, CircularProgress, Popover, Paper, InputAdornment, Grid, Alert,
  AlertTitle, MenuItem, Select, FormControl, InputLabel, useTheme } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

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

const ProductoForm = ({
  anchorEl,
  open,
  currentProducto,
  handleChange,
  onClose,
  onSubmit,
  loading,
  success,
  error,
  handleDelete
}) => {
  const theme = useTheme();
  const normalizedCategoria = currentProducto.categoria
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

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
      <Paper sx={{ p: 4, width: 460, position: 'relative' }}>
        {currentProducto.codigoProducto !== 0 && (
          <IconButton
            onClick={() => handleDelete(currentProducto.codigoProducto)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'error.main',
            }}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          mb={3}
          fontWeight={600}
          textAlign="center"
        >
          {currentProducto.codigoProducto === 0
            ? "Nuevo Producto"
            : "Editar Producto"}
        </Typography>

        {(success || error) && (
          <Box mb={3}>
            {success && (
              <Alert severity="success">
                <AlertTitle>Éxito</AlertTitle>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
          </Box>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Descripción"
                name="descripcion"
                value={currentProducto.descripcion}
                onChange={handleChange}
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

            <Grid item xs={6}>
              <FormControl fullWidth size="small" disabled={loading} sx={{ backgroundColor: theme.palette.background.paper }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={normalizedCategoria}
                  onChange={handleChange}
                  name="categoria"
                  label="Categoría"
                  sx={{
                    ...fieldSx,
                    width: '200px',
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="Suplementos">Suplementos</MenuItem>
                  <MenuItem value="Equipos de Entrenamiento">Equipos de Entrenamiento</MenuItem>
                  <MenuItem value="Accesorios Deportivos">Accesorios</MenuItem>
                  <MenuItem value="Bebidas y Alimentos">Bebidas y Alimentos</MenuItem>
                  <MenuItem value="Recuperación y Cuidado Personal">Cuidado Personal</MenuItem>
                  <MenuItem value="Clases y Servicios">Clases y Servicios</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Precio"
                name="precio"
                value={currentProducto.precio}
                onChange={handleChange}
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  htmlInput: { min: 0, step: 0.01 },
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

            <Grid item xs={6}>
              <FormControl fullWidth size="small" disabled={loading} sx={{ backgroundColor: theme.palette.background.paper }}>
                <InputLabel>Moneda</InputLabel>
                <Select
                  value={currentProducto.moneda}
                  onChange={handleChange}
                  name="moneda"
                  label="Moneda"
                  sx={fieldSx}
                  startAdornment={
                    <InputAdornment position="start">
                      <AttachMoneyIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="NIO">NIO</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Existencias"
                name="existencias"
                value={currentProducto.existencias}
                onChange={handleChange}
                required
                disabled={loading}
                sx={fieldSx}
                slotProps={{
                  htmlInput: { min: 0 },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Stock Mínimo"
                name="stockMinimo"
                value={currentProducto.stockMinimo}
                onChange={handleChange}
                required
                disabled={loading}
                sx={{
                  ...fieldSx,
                  width: '200px'
                }}
                slotProps={{
                  htmlInput: { min: 0 },
                }}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} mt={4}>
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
              {loading
                ? "Guardando..."
                : currentProducto.codigoProducto === 0
                ? "Guardar"
                : "Actualizar"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Popover>
  );
};
export default ProductoForm;