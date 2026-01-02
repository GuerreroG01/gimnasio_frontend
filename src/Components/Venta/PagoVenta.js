import React, { useState, useEffect } from 'react';
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
  handleGuardarVenta
}) => {
  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#fdfdfd',
        borderRadius: 3,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.08)',
        maxWidth: 700,
        margin: '40px auto',
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
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                gap: 1,
              }}
            >
              <Typography>{producto.descripcion}</Typography>
              <Typography align="center">{cantidad}</Typography>
              <Typography align="center">
                {simboloProducto}{producto.precio.toFixed(2)}
              </Typography>
              <Typography align="right" fontWeight="bold">
                {simboloProducto}{subtotal.toFixed(2)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Total a pagar:
        </Typography>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" fontWeight="bold">
            {simboloMoneda}{totalMostrado.toFixed(2)} {monedaTotal}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {simboloTotalEquivalente}{totalEquivalente.toFixed(2)} {monedaTotalEquivalente}
          </Typography>
        </Box>
      </Box>


      <Divider sx={{ my: 2 }} />

      {/* Efectivo */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
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
        <Typography variant="h6" fontWeight="bold">
          Cambio a entregar:
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {simboloMoneda}{cambio.toFixed(2)}
        </Typography>
      </Box>

      {/* ✅ Equivalente del CAMBIO */}
      {cambio > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
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