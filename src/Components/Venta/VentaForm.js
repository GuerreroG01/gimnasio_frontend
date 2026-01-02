import { Container, Grid, Box, Divider, Snackbar, TextField, Typography, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import ProductoCard from './ProductoCard';
import DatosVenta from './DatosVenta';
import PagoVenta from './PagoVenta';

const VentaForm = ({ productosSeleccionados, editMode, handleSelectProduct, handleCantidadChange, total, setError, fechaVenta, handleGuardarVenta,
  openSnackbar, setOpenSnackbar, handleBuscarDescripcion, descripcion, productosFiltrados, onEliminarProducto, mostrarPago, handleVolver,
  handleCompletarVenta, totalPages, page, setPage, itemsPerPage, monedaTotal, setMonedaTotal, simboloMoneda, totalMostrado, mostrarFactura,
  productosPaginados, isLoading, loadingFind, existencias, handleCantidadChangeLocal, efectivo, setEfectivo, cambio, cambioEquivalente, simboloCambioEquivalente, 
  monedaCambioEquivalente, totalEquivalente, simboloTotalEquivalente, monedaTotalEquivalente }) => {

  if (mostrarPago) {
    return (
      <PagoVenta
        productosComprados={productosSeleccionados}
        total={total}
        onVolver={handleVolver}
        totalMostrado={totalMostrado}
        simboloMoneda={simboloMoneda}
        efectivo={efectivo}
        setEfectivo={setEfectivo}
        cambio={cambio}
        cambioEquivalente={cambioEquivalente}
        simboloCambioEquivalente={simboloCambioEquivalente}
        monedaCambioEquivalente={monedaCambioEquivalente}
        totalEquivalente={totalEquivalente}
        simboloTotalEquivalente={simboloTotalEquivalente}
        monedaTotalEquivalente={monedaTotalEquivalente}
        handleGuardarVenta={handleGuardarVenta}
      />
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={4}
        sx={{ marginBottom: 4, flexDirection: { xs: 'column', md: 'row' } }}
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Grid item xs={12} md="auto" sx={{ flexBasis: { md: '30%' }, width: { xs: '100%', md: '40%' } }}>
          <Box
            sx={{
              padding: 3,
              backgroundColor: '#f4f4f4',
              borderRadius: '8px',
              boxShadow: 3,
              marginTop: 4,
              height: '100%',
            }}
          >
            <Typography
              variant="h6"
              align="center"
              sx={{ marginBottom: 3, fontWeight: 'bold' }}
            >
              {editMode ? 'Editar venta' : 'Seleccione productos'}
            </Typography>

            <TextField
              fullWidth
              label="Buscar producto"
              variant="outlined"
              value={descripcion}
              onChange={(e) => handleBuscarDescripcion(e.target.value)}
              sx={{ marginBottom: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingFind ? (
                        <CircularProgress size={20} />
                      ) : (
                        descripcion && (
                          <IconButton
                            aria-label="limpiar búsqueda"
                            onClick={() => handleBuscarDescripcion('')}
                            edge="end"
                          >
                            <CancelIcon />
                          </IconButton>
                        )
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Grid container spacing={3}>
              {productosFiltrados.map((producto) => (
                <Grid item xs={12} sm={6} key={producto.codigoProducto}>
                  <ProductoCard
                    producto={producto}
                    onSelect={handleSelectProduct}
                    isSelected={productosSeleccionados.some(
                      (p) => p.producto.codigoProducto === producto.codigoProducto
                    )}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md="auto" sx={{ flexBasis: { md: '60%' }, width: { xs: '100%', md: '40%' } }}>
          <DatosVenta
            productosSeleccionados={productosSeleccionados}
            total={total}
            setError={setError}
            fechaVenta={fechaVenta}
            onCantidadChange={handleCantidadChange}
            onCompletarVenta={handleCompletarVenta}
            onEliminarProducto={onEliminarProducto}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            itemsPerPage={itemsPerPage}
            monedaTotal={monedaTotal}
            setMonedaTotal={setMonedaTotal}
            simboloMoneda={simboloMoneda}
            totalMostrado={totalMostrado}
            mostrarFactura={mostrarFactura}
            productosPaginados={productosPaginados}
            isLoading={isLoading}
            existencias={existencias}
            handleCantidadChangeLocal={handleCantidadChangeLocal}
          />
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: 4 }} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={editMode ? 'Venta Actualizada' : 'Venta Registrada'}
        disableWindowBlurListener
      />
    </Container>
  );
};
export default VentaForm;