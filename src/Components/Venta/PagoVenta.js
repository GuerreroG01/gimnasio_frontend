import React from 'react';
import { Box, Typography, TextField, Divider, Button } from '@mui/material';

const PagoVenta = ({
  productosComprados,
  onVolver,
  totalMostrado,
  simboloMoneda,
  monedaTotal,
  efectivo,
  setEfectivo,
  cambio,
  cambioEquivalente,
  simboloCambioEquivalente,
  monedaCambioEquivalente,
  totalEquivalente,
  simboloTotalEquivalente,
  monedaTotalEquivalente,
  handleGuardarVenta,
  theme
}) => {
  const formatAmount = (amount) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0px 10px 20px rgba(255,255,255,0.05)'
            : '0px 10px 20px rgba(0,0,0,0.08)',
        maxWidth: 700,
        margin: '10px auto',
      }}
    >
      <Typography variant="h5" fontWeight="bold" color="primary" align="center">
        Resumen de Pago
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Productos */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {productosComprados.map(({ producto, cantidad }, index) => {
          const subtotal = producto.precio * cantidad;
          const simboloProducto = producto.moneda === 'USD' ? '$' : 'C$';

          return (
            <Box
              key={producto.codigoProducto}
              sx={{
                display: 'grid',
                gridTemplateColumns: '5fr 1fr 2fr 2fr',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
                gap: 1,
              }}
            >
              <Typography sx={{ color: (theme) => theme.palette.text.primary }}>{producto.descripcion}</Typography>
              <Typography align="center" sx={{ color: (theme) => theme.palette.text.primary }}>{cantidad}</Typography>
              <Typography align="center" sx={{ color: (theme) => theme.palette.text.primary }}>
                {simboloProducto}{producto.precio.toFixed(2)}
              </Typography>
              <Typography align="right" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
                {simboloProducto}{subtotal.toFixed(2)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: (theme) => theme.palette.text.primary }}>
        <Typography variant="h6" fontWeight="bold">
          Total a pagar:
        </Typography>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
            {simboloMoneda}{formatAmount(totalMostrado)} {monedaTotal}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ color: (theme) => theme.palette.text.secondary }}>
            {simboloTotalEquivalente}{formatAmount(totalEquivalente)} {monedaTotalEquivalente}
          </Typography>
        </Box>
      </Box>


      <Divider sx={{ my: 2 }} />

      {/* Efectivo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
          Efectivo recibido:
        </Typography>
        <TextField
          type="number"
          value={efectivo}
          onChange={(e) => setEfectivo(e.target.value)}
          sx={{ width: 200 }}
        />
      </Box>

      {/* Cambio */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
          Cambio a entregar:
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: (theme) => theme.palette.text.primary }}>
          {simboloMoneda}{cambio.toFixed(2)}
        </Typography>
      </Box>

      {/* ✅ Equivalente del CAMBIO */}
      {cambio > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3, color: (theme) => theme.palette.text.secondary }}>
          Equivalente del cambio en {monedaCambioEquivalente}:{' '}
          <strong>
            {simboloCambioEquivalente}{cambioEquivalente.toFixed(2)} {monedaCambioEquivalente}
          </strong>
        </Typography>
      )}

      {/* Botones */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={onVolver}>
          Volver
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleGuardarVenta}
          fullWidth
          disabled={parseFloat(efectivo) < totalMostrado}
        >
          Confirmar Pago
        </Button>
      </Box>
    </Box>
  );
};
export default PagoVenta;