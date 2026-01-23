import React, { useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider, CircularProgress, Chip, Pagination, Stack, Tooltip, IconButton, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DatosVenta = ({ productosSeleccionados, onCantidadChange, onEliminarProducto, fechaVenta, totalPages,
    page, setPage, itemsPerPage, monedaTotal, setMonedaTotal, simboloMoneda, totalMostrado, mostrarFactura, isLoading, 
    productosPaginados, existencias, handleCantidadChangeLocal, theme, alpha
  }) => {
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 600,
        margin: '40px auto'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Datos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fecha: {fechaVenta}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: 120 }}>
        {productosPaginados.map(({ producto, cantidad }, index) => {
          const existenciasActual = existencias?.[producto.codigoProducto] ?? producto.existencias ?? 0;
          const subtotal = producto.precio * cantidad;
          const monedaSimbolo = producto.moneda === 'USD' ? '$' : 'C$';

          return (
            <Box
              key={producto.codigoProducto}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor:
                  index % 2 === 0
                    ? theme.palette.background.default
                    : theme.palette.background.paper,
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: theme.palette.action.hover }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.primary }}>{producto.descripcion}</Typography>
                <Tooltip title={`Existencias: ${existenciasActual}`}>
                  <Chip
                    variant="dot"
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: existenciasActual <= 5 
                        ? (theme) => alpha(theme.palette.warning.light, 0.7) 
                        : (theme) => alpha(theme.palette.success.light, 0.7)
                    }}
                  />
                </Tooltip>
              </Box>

              <TextField
                type="number"
                size="small"
                value={cantidad}
                onChange={(e) =>
                  handleCantidadChangeLocal(producto.codigoProducto, e.target.value, existenciasActual)
                }
                inputProps={{ min: 1, max: existenciasActual }}
                sx={{ width: 60, color: (theme) => theme.palette.text.primary }}
              />

              <Typography variant="body2" align="right" sx={{ color: (theme) => theme.palette.text.primary }}>
                {monedaSimbolo}{producto.precio.toFixed(2)}
              </Typography>

              <Typography variant="body2" align="right" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
                {monedaSimbolo}{subtotal.toFixed(2)}
              </Typography>

              <IconButton
                color="error"
                size="small"
                onClick={() => onEliminarProducto(producto.codigoProducto)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
      </Box>

      {totalPages > 1 && (
        <Stack alignItems="center" spacing={1}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
            siblingCount={0}
          />
          <Typography variant="caption" color="text.secondary">
            Mostrando {Math.min(page * itemsPerPage, productosSeleccionados.length)} de{' '}
            {productosSeleccionados.length} productos
          </Typography>
        </Stack>
      )}

      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Total
          </Typography>

          <Select
            size="small"
            value={monedaTotal}
            onChange={(e) => setMonedaTotal(e.target.value)}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="NIO">NIO</MenuItem>
          </Select>
        </Box>

        <Typography variant="h6" fontWeight="bold" color="primary">
          {simboloMoneda}{totalMostrado.toFixed(2)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={mostrarFactura}
        disabled={isLoading}
        sx={{
          mt: 2,
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: 2,
          py: 1.5
        }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Completar Venta'}
      </Button>
    </Box>
  );
};
export default DatosVenta;