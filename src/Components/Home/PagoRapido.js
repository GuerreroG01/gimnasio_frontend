import React, { useEffect, useRef, useCallback } from 'react';
import { Popover, Box, Typography, Button, CircularProgress, TextField, Autocomplete, MenuItem, Grid,
  Paper, Chip } from '@mui/material';
import pagoService from '../../Services/PagoService';
import TiposPagoService from '../../Services/Tipo_PagosService';
import TipoCambioService from '../../Services/TipoCambioService';

import {
  convertirPrecio,
  obtenerMonedaEquivalente,
  obtenerSimboloMoneda
} from '../../Utils/MonedaUtils';

import dayjs from 'dayjs';

const PagoRapido = ({ anchorEl, cliente, onClose, onPagoRenovado }) => {

  const hoy = dayjs();
  const fechaPago = hoy.format('DD/MM/YYYY');

  const [loadingPago, setLoadingPago] = React.useState(false);
  const [loadingTiposPago, setLoadingTiposPago] = React.useState(false);

  const [tiposPago, setTiposPago] = React.useState([]);
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = React.useState(null);

  const [moneda, setMoneda] = React.useState('NIO');
  const [montoBase, setMontoBase] = React.useState(0);
  const [monedaBase, setMonedaBase] = React.useState('NIO');

  const [monto, setMonto] = React.useState(0);
  const [efectivo, setEfectivo] = React.useState(0);
  const [cambio, setCambio] = React.useState(0);
  const [cambioEquivalente, setCambioEquivalente] = React.useState(0);

  const [mesesPagados, setMesesPagados] = React.useState(1);
  const [intervaloPago, setIntervaloPago] = React.useState(1);
  const [nuevaFechaVencimiento, setNuevaFechaVencimiento] = React.useState(null);

  const [tipoCambio, setTipoCambio] = React.useState([]);

  const searchTimeout = useRef(null);
  const autocompleteDelay = 800;

  useEffect(() => {
    TipoCambioService.getTipoCambios()
      .then(setTipoCambio)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!montoBase) return;
    const convertido = convertirPrecio( montoBase, monedaBase, moneda, tipoCambio );
    setMonto(convertido);
  }, [moneda, montoBase, monedaBase, tipoCambio]);

  useEffect(() => {
    const nuevoCambio = Math.max(0, (efectivo || 0) - monto);
    setCambio(nuevoCambio);

    const monedaDestino = obtenerMonedaEquivalente(moneda);
    const cambioEq = convertirPrecio(nuevoCambio, moneda, monedaDestino, tipoCambio);
    setCambioEquivalente(cambioEq);

  }, [efectivo, monto, moneda, tipoCambio]);

  useEffect(() => {
    if (!tipoPagoSeleccionado) return;

    let baseFecha = hoy;

    if (cliente?.diasRestantes > 0 && cliente?.fechaVencimiento) {
      baseFecha = dayjs(cliente.fechaVencimiento);
    }

    let nuevaFecha = baseFecha;

    if (intervaloPago === 1) {
      nuevaFecha = nuevaFecha.add(mesesPagados, 'month');
    } else {
      nuevaFecha = nuevaFecha.add(mesesPagados, 'day');
    }

    setNuevaFechaVencimiento(nuevaFecha.format('DD/MM/YYYY'));

  }, [tipoPagoSeleccionado, mesesPagados, intervaloPago, cliente]);

  const handleBuscarTipoPagoDebounced = (inputValue) => {
    if (!inputValue) return;

    setLoadingTiposPago(true);

    TiposPagoService.searchTipoPagoByName(inputValue)
      .then(res => setTiposPago(res.data))
      .finally(() => setLoadingTiposPago(false));
  };

  const handleTipoPagoInputChange = (event, value, reason) => {
    if (reason !== 'input') return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      handleBuscarTipoPagoDebounced(value);
    }, autocompleteDelay);
  };

  const handleTipoPagoChange = useCallback((event, value) => {
    if (!value) return;

    setTipoPagoSeleccionado(value);

    setMontoBase(value.monto);
    setMonedaBase(value.moneda);
    setMesesPagados(value.duracion);
    setIntervaloPago(
      value.unidadTiempo.toLowerCase() !== 'dias' ? 1 : 0
    );

  }, []);

  const getEstadoColor = () => {
    if (!cliente?.diasRestantes) return 'error';
    if (cliente.diasRestantes <= 3) return 'warning';
    return 'success';
  };

  const handlePagoRapido = async () => {

    if (!tipoPagoSeleccionado) return;
    setLoadingPago(true);

    try {

      await pagoService.createPago({
        CodigoCliente: cliente.codigo,
        MesesPagados: mesesPagados,
        FechaPago: new Date(),
        Moneda: moneda,
        Efectivo: efectivo,
        Cambio: cambio,
        Monto: monto,
        DetallePago: 'Pago rápido',
        IntervaloPago: intervaloPago,
        CodigoTipoPago: tipoPagoSeleccionado.codigoPago
      });

      onPagoRenovado?.(cliente.codigo);
      onClose();

    } catch (err) {
      console.error(err);
      alert('Error al procesar el pago');
    } finally {
      setLoadingPago(false);
    }
  };
  const resetForm = () => {
    setTipoPagoSeleccionado(null);
    setMoneda('NIO');
    setMontoBase(0);
    setMonto(0);
    setEfectivo(0);
    setCambio(0);
    setCambioEquivalente(0);
    setMesesPagados(1);
    setIntervaloPago(1);
    setNuevaFechaVencimiento(null);
  };
  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      slotProps={{
        paper: {
          className: 'scroll-hide',
          sx: {
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 3
          }
        }
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 650,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={(theme) => ({
            p: 2.5,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                : 'linear-gradient(135deg, #1976d2, #1565c0)',
            color: 'white',
          })}
        >
          <Typography variant="h6" fontWeight="bold">
            Pago rápido
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {cliente?.nombreCompleto}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Información actual
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Fecha de Pago
                </Typography>
                <Typography fontWeight="bold" mb={1}>
                  {fechaPago}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Vence actualmente
                </Typography>
                <Typography fontWeight="bold">
                  {cliente?.fechaVencimiento
                    ? dayjs(cliente.fechaVencimiento).format('DD/MM/YYYY')
                    : '--'}
                </Typography>

                <Box mt={1.5}>
                  <Chip
                    label={
                      cliente?.diasRestantes > 0
                        ? `${cliente.diasRestantes} días restantes`
                        : 'Vencido'
                    }
                    color={getEstadoColor()}
                    size="small"
                  />
                </Box>
              </Paper>

              {nuevaFechaVencimiento && (
                <Paper
                  elevation={0}
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <Typography variant="caption">Nuevo vencimiento</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {nuevaFechaVencimiento}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={tiposPago}
                loading={loadingTiposPago}
                getOptionLabel={(option) => option?.descripcion || ''}
                onChange={handleTipoPagoChange}
                onInputChange={handleTipoPagoInputChange}
                renderInput={(params) => <TextField {...params} label="Tipo de Pago" fullWidth />}
              />

              <TextField
                select
                fullWidth
                label="Moneda"
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                sx={{ mt: 2 }}
              >
                <MenuItem value="NIO">NIO</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {obtenerSimboloMoneda(moneda)} {monto.toFixed(2)}
                </Typography>

                <TextField
                  fullWidth
                  label="Efectivo"
                  type="number"
                  value={efectivo}
                  onChange={(e) => setEfectivo(Number(e.target.value))}
                  sx={{ mt: 2 }}
                />

                <Box mt={2}>
                  <Typography variant="body2">Cambio:</Typography>
                  <Typography fontWeight="bold">
                    {obtenerSimboloMoneda(moneda)} {cambio.toFixed(2)}
                  </Typography>

                  {cambioEquivalente > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Equivalente: {obtenerSimboloMoneda(obtenerMonedaEquivalente(moneda))}{' '}
                      {cambioEquivalente.toFixed(2)}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            color="success"
            size="large"
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 'bold',
            }}
            onClick={handlePagoRapido}
            disabled={loadingPago}
          >
            {loadingPago ? <CircularProgress size={22} /> : 'Confirmar Pago'}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};
export default PagoRapido;