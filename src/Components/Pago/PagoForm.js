import { Divider, Autocomplete, Grid, Paper, Box, Button, TextField, MenuItem, Typography, CircularProgress} from '@mui/material';
import dayjs from 'dayjs';
import { obtenerSimboloMoneda, obtenerMonedaEquivalente } from '../../Utils/MonedaUtils';

const PagoForm = ({ formik, loading, pagoId, monedas, clientes, loadingClientes, handleInputChange, tiposPago, loadingTiposPago,
  handleTipoPagoInputChange, handleTipoPagoChange, cambioEquivalente, cargarUltimoPago
 }) => {
  if (loading) return <CircularProgress />;
  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1100,
        margin: 'auto',
        padding: 4,
        borderRadius: 3,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {pagoId ? 'Actualizar Pago' : 'Registrar Pago'}
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          {/* COLUMNA IZQUIERDA */}
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{
                    width: { xs: '100%', sm: 250, md: 250 },
                  }}
                  options={clientes}
                  getOptionLabel={(option) =>
                    `${option.nombres} ${option.apellidos}`
                  }
                  loading={loadingClientes}
                  noOptionsText="No hay resultados"
                  onInputChange={handleInputChange}
                  onChange={(event, value) => {
                    const codigo = value ? value.codigo : "";
                    formik.setFieldValue("CodigoCliente", codigo);

                    if (codigo) {
                      cargarUltimoPago(codigo);
                    }
                  }}
                  value={
                    clientes.find((c) => c.codigo === formik.values.CodigoCliente) ||
                    (formik.values.CodigoCliente
                      ? { codigo: formik.values.CodigoCliente, nombres: "", apellidos: "", telefono: "" }
                      : null)
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option.codigo}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>
                          {option.nombres} {option.apellidos}
                        </span>
                        <small style={{ color: "#888" }}>
                          Código: {option.codigo} | Tel: {option.telefono}
                        </small>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      error={formik.touched.CodigoCliente && Boolean(formik.errors.CodigoCliente)}
                      helperText={formik.touched.CodigoCliente && formik.errors.CodigoCliente}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingClientes ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{
                    width: { xs: '100%', sm: 250, md: 250 },
                  }}
                  options={tiposPago}
                  loading={loadingTiposPago}
                  noOptionsText="No hay resultados"
                  value={formik.values.TipoPago || null}
                  isOptionEqualToValue={(option, value) =>
                    option.codigoPago === value.codigoPago
                  }
                  getOptionLabel={(option) => option?.descripcion || ""}
                  onChange={(event, value) => {
                    formik.setFieldValue("TipoPago", value);
                    handleTipoPagoChange(event, value);
                  }}
                  onInputChange={handleTipoPagoInputChange}

                  renderOption={(props, option) => (
                    <li {...props} key={option.codigoPago}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span>{option.descripcion}</span>
                        <small style={{ color: "#888" }}>
                          Monto: {option.monto} | Duración: {option.duracion} {option.unidadTiempo}
                        </small>
                      </div>
                    </li>
                  )}

                  renderInput={(params) => (
                    <TextField
                      label="Tipo de Pago"
                      {...params}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingTiposPago ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps?.endAdornment}
                            </>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  multiline
                  minRows={3}
                  sx={{
                    width: { xs: '100%', sm: 250, md: 250 },
                  }}
                  label="Detalle"
                  name="DetallePago"
                  value={formik.values.DetallePago}
                  onChange={formik.handleChange}
                  error={formik.touched.DetallePago && Boolean(formik.errors.DetallePago)}
                  helperText={formik.touched.DetallePago && formik.errors.DetallePago}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Moneda"
                  name="Moneda"
                  value={formik.values.Moneda}
                  onChange={formik.handleChange}
                  error={formik.touched.Moneda && Boolean(formik.errors.Moneda)}
                  helperText={formik.touched.Moneda && formik.errors.Moneda}
                >
                  {monedas.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', sm: 'block' },
              borderColor: 'grey.300',
              mx: 2,
            }}

          />
          {/* COLUMNA DERECHA */}
          <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
            <Grid item xs={12} sm={4}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>

                  {/* COLUMNA IZQUIERDA */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Monto
                    </Typography>
                    <Typography variant="h6" mb={1}>
                      {obtenerSimboloMoneda(formik.values.Moneda)} {formik.values.Monto.toFixed(2)}
                    </Typography>
                    <TextField
                      fullWidth
                      label="Efectivo"
                      name="Efectivo"
                      type="number"
                      variant="standard"
                      value={formik.values.Efectivo}
                      onChange={formik.handleChange}
                      sx={{ mb: 1 }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      Cambio
                    </Typography>
                    <Typography variant="h6">
                      {obtenerSimboloMoneda(formik.values.Moneda)} {formik.values.Cambio.toFixed(2)}
                    </Typography>
                    {cambioEquivalente > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Equivalente: {obtenerSimboloMoneda(obtenerMonedaEquivalente(formik.values.Moneda))}{' '}
                        {cambioEquivalente.toFixed(2)}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Pago
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      {formik.values.FechaPago
                        ? dayjs(formik.values.FechaPago).format('DD/MM/YYYY')
                        : '--'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Duración
                    </Typography>
                    <Typography variant="body2">
                      {formik.values.MesesPagados}{' '}
                      {formik.values.IntervaloPago ? 'Meses' : 'Días'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Box>
        </Box>

        {/* BOTONES */}
        <Box mt={3} display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ minWidth: 180 }}
            disabled={formik.isSubmitting}
          >
            {pagoId ? 'Actualizar' : 'Registrar'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
export default PagoForm;