import { Container, Grid, Box, Divider, Snackbar, Button, ButtonGroup, Typography } from '@mui/material';
import ProductoCard from './ProductoCard';
import DatosVenta from './DatosVenta';

const VentaForm = ({ productoSeleccionado, editMode, allProductos, handleLetterClick, selectedLetter, productos,
    handleSelectProduct, cantidad, setCantidad, total, setTotal, setError, handleGuardarVenta, ventaActual, setPrecioEspecial,
    openSnackbar, setOpenSnackbar }) => {          

    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ padding: 3, backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: 3, marginTop: 4 }}>
                        {!productoSeleccionado && (
                            <Typography variant="h6" align="center" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                                {editMode ? 'Editar venta' : 'Seleccione un producto'}
                            </Typography>
                        )}
                        <ButtonGroup
                            variant="text"
                            sx={{ marginBottom: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}
                        >
                            {Array.from(new Set(allProductos.map((producto) => producto.descripcion[0].toUpperCase()))).sort().map((letra) => (
                                <Button
                                    key={letra}
                                    onClick={() => handleLetterClick(letra)}
                                    sx={{
                                        backgroundColor: selectedLetter === letra ? '#1976d2' : 'transparent',
                                        '&:hover': { backgroundColor: '#eeeeee' },
                                        color: selectedLetter === letra ? '#fff' : '#1976d2',
                                        fontWeight: selectedLetter === letra ? 'bold' : 'normal',
                                        textTransform: 'none',
                                    }}
                                >
                                    {letra}
                                </Button>
                            ))}
                        </ButtonGroup>
                        <Grid container spacing={3}>
                            {productos.map((producto) => (
                                <Grid item xs={12} sm={6} key={producto.codigoProducto}>
                                    <ProductoCard
                                        producto={producto}
                                        onSelect={handleSelectProduct}
                                        isSelected={productoSeleccionado?.codigoProducto === producto.codigoProducto}
                                        esProductoEditando={editMode && productoSeleccionado?.codigoProducto === producto.codigoProducto}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>
                {productoSeleccionado && (
                    <Grid item xs={12} md={6}>
                        <DatosVenta
                            productoSeleccionado={productoSeleccionado}
                            cantidad={cantidad}
                            setCantidad={setCantidad}
                            setTotal={setTotal}
                            setError={setError}
                            handleregistrarDatos={handleGuardarVenta}
                            total={total}
                            editMode={editMode}
                            setPrecioEspecial={setPrecioEspecial}
                            ventaActual={ventaActual}
                        />
                    </Grid>
                )}
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