import {
  TextField, Checkbox, FormControlLabel, Button, Box, Typography,
  Alert, AlertTitle, CircularProgress, Grid, Paper
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const FormularioCliente = ({
  id, cliente, setCliente, fileName, imagePreview, exitocreacion,
  mensaje_error, mensajeAlerta, setMensajeAlerta, cargando,
  handleChange, handleFileChange, handleSubmitCreate,
  handleSubmitUpdate, handleTelefonoChange, navigate
}) => {

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1100,
        margin: 'auto',
        padding: 4,
        borderRadius: 3,
        backgroundColor: '#fff'
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {id ? 'Actualizar Cliente' : 'Nuevo Cliente'}
      </Typography>

      <form onSubmit={id ? handleSubmitUpdate : handleSubmitCreate}>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" }, // <--- EN XS (celular) se apila, desde sm se pone lado a lado
          }}
        >

          {/* COLUMNA IZQUIERDA (Foto + selector) */}
          <Box sx={{ width: { xs: "100%", sm: "35%" } }}>
            <Box textAlign="center">
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAltIcon />}
                sx={{ marginBottom: 2, width: '100%' }}
              >
                {fileName || 'Seleccionar foto'}
                <input type="file" hidden onChange={handleFileChange} />
              </Button>

              {imagePreview && (
                <Box
                  sx={{
                    width: '100%',
                    height: 250,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid #ddd'
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}

            </Box>
          </Box>

          {/* COLUMNA DERECHA (Datos del cliente) */}
          <Box sx={{ width: { xs: "100%", sm: "65%" } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombres"
                  name="nombres"
                  value={cliente.nombres}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  name="apellidos"
                  value={cliente.apellidos}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={handleTelefonoChange}
                />
              </Grid>

              <Grid size={{ xs: 6, md: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Observaciones"
                  name="observaciones"
                  value={cliente.observaciones}
                  onChange={handleChange}
                  sx={{ width: "100%", maxWidth: "900px" }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha de Ingreso"
                  type="date"
                  name="fechaIngreso"
                  value={
                    cliente.fechaIngreso
                      ? cliente.fechaIngreso.split('T')[0]
                      : new Date().toISOString().split('T')[0]
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled
                />
              </Grid>

            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="activo"
                      checked={cliente.activo}
                      onChange={handleChange}
                    />
                  }
                  label="Activo"
                />
              </Grid>
          </Box>

        </Box>

        {/* BOTONES */}
        <Box mt={3} display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={cargando}
            sx={{ minWidth: 180 }}
          >
            {cargando ? <CircularProgress size={24} /> : id ? 'Actualizar' : 'Crear'}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
            sx={{ minWidth: 120 }}
          >
            Atrás
          </Button>
        </Box>
      </form>

      {/* MENSAJES */}
      {exitocreacion && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <AlertTitle>Éxito</AlertTitle>
          {exitocreacion}
        </Alert>
      )}

      {mensaje_error && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <AlertTitle>Advertencia</AlertTitle>
          {mensaje_error}
        </Alert>
      )}

      {mensajeAlerta && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          onClose={() => setMensajeAlerta('')}
        >
          <AlertTitle>Error</AlertTitle>
          {mensajeAlerta}
        </Alert>
      )}

    </Paper>
  );
};
export default FormularioCliente;