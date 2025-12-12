/*import React, { useState, useEffect } from 'react';
import { Popover, Box, Typography, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import pagoService from '../../Services/PagoService';
import FechasUsuarioService from '../../Services/FechasUsuarioService';
import TipoPagoService from '../../Services/Tipo_PagosService';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PagoRapido = ({ anchorEl, usuario, onClose, onPagoRenovado }) => {
  const [loadingPago, setLoadingPago] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rangoPagoUnidad, setRangoPagoUnidad] = useState('dias');
  const [cantidadPago, setCantidadPago] = useState(1);
  const [montoCalculado, setMontoCalculado] = useState(0);
  const [tipoDiaSeleccionado, setTipoDiaSeleccionado] = useState(null);
  const [tiposEjercicio, setTiposEjercicio] = useState([]);
  const [fechaVencimientoPreview, setFechaVencimientoPreview] = useState(null);

  const ahora = new Date();
  const fechaPagoActual = new Date(
    ahora.toLocaleDateString('es-ES', {
      timeZone: 'America/Managua',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-') + 'T00:00:00-06:00'
  );
  useEffect(() => {
    const fetchTipos = async () => {
      const data = await TipoPagoService.getTipoEjercicios();
      if (data) {
        setTiposEjercicio(data.filter(e => e.activo));
      }
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    if (rangoPagoUnidad === 'meses') {
      const tipoMes = tiposEjercicio.find(t => t.descripcion.toLowerCase() === 'mes');
      if (tipoMes && cantidadPago > 0) {
        setMontoCalculado(cantidadPago * tipoMes.costo);
      }
    } else if (rangoPagoUnidad === 'dias' && tipoDiaSeleccionado) {
      setMontoCalculado(tipoDiaSeleccionado.costo);
    }
  }, [rangoPagoUnidad, cantidadPago, tipoDiaSeleccionado, tiposEjercicio]);

  useEffect(() => {
    let base = new Date();
    let nuevaFecha = new Date(base);
    if (rangoPagoUnidad === 'dias' && tipoDiaSeleccionado) {
      const dias = tipoDiaSeleccionado.descripcion.includes('15') ? 15 : 7;
      nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    }
    if (rangoPagoUnidad === 'meses') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + cantidadPago);
    }
    nuevaFecha.setHours(0, 0, 0, 0);
    setFechaVencimientoPreview(nuevaFecha);
  }, [rangoPagoUnidad, cantidadPago, tipoDiaSeleccionado]);

    const handlePagoRapido = async () => {
        setLoadingPago(true);
        setErrorMessage('');

        const ahora = new Date();
        const fechaPagoActual = new Date(
          ahora.toLocaleDateString('es-ES', {
            timeZone: 'America/Managua',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).split('/').reverse().join('-') + 'T00:00:00-06:00'
        );
        const usuarioId = usuario.codigo;
        console.log('Fecha de pago actual', fechaPagoActual);
        const fechaPago = new Date(fechaPagoActual);
        console.log('Fechapago:', fechaPago);
        let rangoPago = parseInt(cantidadPago, 10);

        if (rangoPagoUnidad === 'dias' && tipoDiaSeleccionado) {
        const descripcion = tipoDiaSeleccionado.descripcion.toLowerCase();
        if (descripcion.includes('15')) {
            rangoPago = 15;
        } else if (descripcion.includes('7') || descripcion.includes('semana')) {
            rangoPago = 7;
        } else {
            rangoPago = 1;
        }
        }


        const intervaloPago = rangoPagoUnidad === 'dias' ? 0 : 1;

        if (rangoPagoUnidad === 'dias' && !tipoDiaSeleccionado) {
        setErrorMessage('Debes seleccionar un tipo de pago por días.');
        setLoadingPago(false);
        return;
        }

        try {
        let diasRestantes = 0;
        let fechaVencimientoUltimoPago = new Date(fechaPago);

        try {
            const ultimoPago = await pagoService.getUltimoPagoVigente(usuarioId, false);
            if (ultimoPago?.fechaVencimiento) {
            fechaVencimientoUltimoPago = new Date(ultimoPago.fechaVencimiento);
            diasRestantes = ultimoPago.diasRestantes;
            }
            console.log('Datos del ultimo pago vigente', ultimoPago);
        } catch {}

        let fechaVencimiento = new Date(fechaVencimientoUltimoPago);

        if (diasRestantes > 0) {
            if (rangoPagoUnidad === 'dias') {
            fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago - 1);
            } else {
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
            fechaVencimiento.setDate(fechaVencimiento.getDate() - 1);
            }
        } else {
            fechaVencimiento = new Date(fechaPago);
            if (rangoPagoUnidad === 'dias') {
            fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago);
            } else {
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
            }
        }

        fechaVencimiento.setHours(0, 0, 0, 0);
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);

        if (isNaN(fechaVencimiento)) {
            setErrorMessage('Fecha de vencimiento no válida');
            setLoadingPago(false);
            return;
        }

        const fechasData = {
            UsuarioId: usuarioId,
            FechaPago: fechaPagoActual,
            FechaPagoA: fechaPagoActual,
            FechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        };

        const datosPago = {
            CodigoUsuario: usuarioId,
            FechaPago: fechaPagoActual,
            MesesPagados: cantidadPago,
            intervaloPago,
            monto: montoCalculado,
            DetallePago: '',
        };

        await FechasUsuarioService.createFecha(fechasData);
        await pagoService.createPago(datosPago);
        console.log('Datos de fechas usuario', fechasData);
        console.log('Datos del pago', datosPago);

        setPagoExitoso(true);
        setTimeout(() => {
            if (onPagoRenovado) {
                onPagoRenovado(usuario.codigo);
            } else {
                onClose();
            }
        }, 1500);
        } catch {
        setErrorMessage('Error al procesar el pago');
        } finally {
        setLoadingPago(false);
        }
    };

  const handleClose = () => {
    setPagoExitoso(false);
    setErrorMessage('');
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return 'No proporcionado';
    const zonedDate = toZonedTime(new Date(date), 'America/Managua');
    return format(zonedDate, 'dd MMMM yyyy', { locale: es });
  };
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
    >
      <Box sx={{ p: 3, width: 350, bgcolor: 'background.paper', borderRadius: 2 }}>
        {pagoExitoso ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" sx={{ color: 'success.main', py: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />
            <Typography variant="h6" sx={{ mt: 1 }}>
                Pago realizado con éxito
            </Typography>
            </Box>        
        ) : (
          <>
            <Typography variant="h6" gutterBottom align="center">
              Renovar a {usuario?.nombreCompleto}
            </Typography>

            <Typography variant="body2" color="textSecondary" gutterBottom align="center">
              Fecha de pago: <strong>{formatDate(fechaPagoActual)}</strong>
            </Typography>

            {fechaVencimientoPreview && (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                Fecha de vencimiento: <strong>{formatDate(fechaVencimientoPreview)}</strong>
              </Typography>
            )}

            <FormControl variant="filled" fullWidth margin="normal" size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={rangoPagoUnidad}
                onChange={(e) => {
                  setRangoPagoUnidad(e.target.value);
                  setCantidadPago(1);
                  setTipoDiaSeleccionado(null);
                }}
                fullWidth
              >
                <MenuItem value="meses">Meses</MenuItem>
                <MenuItem value="dias">Días</MenuItem>
              </Select>
            </FormControl>

            {rangoPagoUnidad === 'meses' ? (
              <FormControl variant="filled" fullWidth margin="normal" size="small">
                <InputLabel>Meses a pagar</InputLabel>
                <Select
                  value={cantidadPago}
                  onChange={(e) => setCantidadPago(Number(e.target.value))}
                >
                  {[...Array(12).keys()].map((num) => (
                    <MenuItem key={num + 1} value={num + 1}>
                      {num + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl variant="filled" fullWidth margin="normal" size="small">
                <InputLabel>Tipo de pago por días</InputLabel>
                <Select
                  value={tipoDiaSeleccionado?.codigo || ''}
                  onChange={(e) => {
                    const selected = tiposEjercicio.find(t => t.codigo === e.target.value);
                    setTipoDiaSeleccionado(selected);
                  }}
                >
                  {tiposEjercicio
                    .filter(t =>
                      t.descripcion.toLowerCase().includes('dia') ||
                      t.descripcion.toLowerCase().includes('semana')
                    )
                    .map((tipo) => (
                      <MenuItem key={tipo.codigo} value={tipo.codigo}>
                        {tipo.descripcion}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            <Typography variant="body2" color="textPrimary" align="center" sx={{ mt: 2 }}>
              Monto calculado: <strong>${montoCalculado.toFixed(2)}</strong>
            </Typography>

            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="contained"
                color="success"
                onClick={handlePagoRapido}
                disabled={loadingPago}
                fullWidth
              >
                {loadingPago ? <CircularProgress size={20} /> : 'Confirmar Pago'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};
export default PagoRapido;*/