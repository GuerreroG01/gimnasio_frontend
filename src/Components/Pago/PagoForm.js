import { TextField, Button, Grid, Autocomplete, Container, Typography, Alert, Snackbar, IconButton, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Payment, AttachMoney, Edit, EditOff, CalendarToday } from '@mui/icons-material';
import SeleccionCliente from './SeleccionCliente';
import FechaVencimiento from './FechaVencimiento';

const PagoForm = ({ clienteId, editMode, handleSubmit, selectedUserName, handleClickEditIcon, showSeleccionCliente, rangoPagoUnidad,
  setDiasSeleccionados, setUserEditedSelect, handleChange, pagoData, setPagoData, loading, errorMessage, 
  setErrorMessage, handleSelectCliente, handleRangoPagoUnidadChange, loadingTiposPago, tiposPago, setSearchText, setTipoPagoSeleccionado }) => {
    
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            boxShadow: 3,
            p: 4,
            mt: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#333' }}
          >
            {editMode ? 'Editar Pago' : 'Registrar Pago'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Cliente"
                    fullWidth
                    disabled
                    value={selectedUserName}
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                    InputProps={{
                      endAdornment: !editMode && (
                        <IconButton onClick={handleClickEditIcon}>
                          {showSeleccionCliente ? <Edit /> : <EditOff />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Monto"
                    fullWidth
                    name="Monto"
                    value={pagoData.Monto || ''}
                    onChange={(e) =>
                      setPagoData({ ...pagoData, Monto: e.target.value })
                    }
                    required
                    InputProps={{
                      startAdornment: <AttachMoney sx={{ mr: 1, color: '#6c757d' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Fecha de pago"
                    type="date"
                    fullWidth
                    name="FechaPago"
                    value={pagoData.FechaPago}
                    onChange={handleChange}
                    required
                    disabled={editMode}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <CalendarToday sx={{ mr: 1, color: '#6c757d' }} />,
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} container direction="column" spacing={2}>
                <Grid item xs={12} sx={{ width: 250 }}>
                  <ToggleButtonGroup
                    value={rangoPagoUnidad}
                    exclusive
                    onChange={handleRangoPagoUnidadChange}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      boxShadow: 1,
                      '& .MuiToggleButton-root': {
                        flex: 1,
                        border: 'none',
                        fontWeight: 500,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <ToggleButton value="meses">Meses</ToggleButton>
                    <ToggleButton value="dias">Días</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid container spacing={2} sx={{ maxWidth: 250, margin: '0 auto' }}>
                  <Grid item xs={12}>
                    <TextField
                      label={rangoPagoUnidad === 'meses' ? 'Meses a pagar' : 'Días a pagar'}
                      type="number"
                      fullWidth
                      name="MesesPagados"
                      value={pagoData.MesesPagados}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: <Payment sx={{ mr: 1, color: '#6c757d' }} />,
                      }}
                    />
                  </Grid>
                  {rangoPagoUnidad === 'dias' && (
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        sx={{ width: 245 }}
                        fullWidth={false}
                        loading={loadingTiposPago}
                        options={tiposPago}
                        getOptionLabel={(option) => option.descripcion}
                        filterOptions={(x) => x}
                        onInputChange={(event, value, reason) => {
                          if (reason === 'input') {
                            setSearchText(value);
                          }
                        }}
                        onChange={(event, value) => {
                          setUserEditedSelect(true);
                          setTipoPagoSeleccionado(value);

                          if (value) {
                            setDiasSeleccionados(value.duracion);
                            setPagoData((prev) => ({
                              ...prev,
                              MesesPagados: value.duracion,
                              Monto: value.monto,
                            }));
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tipos de Pagos"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loadingTiposPago && <CircularProgress size={20} />}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <TextField
                label="Detalle del pago (opcional)"
                multiline
                rows={3}
                fullWidth
                name="DetallePago"
                value={pagoData.DetallePago}
                onChange={handleChange}
                sx={{ maxWidth: 380 }}
              />
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  disabled={loading}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 2,
                    mt: 4,
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : editMode ? (
                    'Actualizar'
                  ) : (
                    'Registrar'
                  )}
                </Button>
              </Grid>

            </Grid>
          </form>
        </Container>
      </Grid>
      <Grid item xs={12} md={6}>
        <Container sx={{ position: 'relative', paddingTop: 3 }}>
          {showSeleccionCliente  && (
            <SeleccionCliente
              onSelectCliente={handleSelectCliente}
            />
          )}
          <Snackbar
            open={errorMessage !== ''}
            autoHideDuration={5000}
            onClose={() => setErrorMessage('')}
          >
            <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
              {typeof errorMessage === 'string' ? errorMessage : 'Hubo un error'}
            </Alert>
          </Snackbar>
          <FechaVencimiento
            clienteId={pagoData.CodigoCliente}
            fechaPago={pagoData.FechaPago}
            mesesPagados={pagoData.MesesPagados}
            rangoPagoUnidad={rangoPagoUnidad}
          />
        </Container>
      </Grid>
    </Grid>
  );
};
export default PagoForm;