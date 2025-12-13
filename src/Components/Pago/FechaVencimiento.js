import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Divider, Chip } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import pagoService from '../../Services/PagoService';

const FechaVencimiento = ({ usuarioId, fechaPago, mesesPagados, rangoPagoUnidad }) => {
  const [fechaVencimiento, setFechaVencimiento] = useState(null);
  const [ultimoPago, setUltimoPago] = useState(null);
  useEffect(() => {
    if (!usuarioId || !fechaPago || mesesPagados == null || !rangoPagoUnidad) return;

    const handler = setTimeout(() => {
      const calcularFechaVencimiento = async () => {
        const fechaPagoDate = new Date(fechaPago);
        const rango = parseInt(mesesPagados, 10);

        if (isNaN(fechaPagoDate.getTime()) || isNaN(rango)) {
          setFechaVencimiento(null);
          setUltimoPago(null);
          return;
        }
        let fechaBase = new Date(fechaPagoDate);

        try {
          const pago = await pagoService.getUltimoPagoVigente(usuarioId, false);
          if (pago && pago.fechaVencimiento) {
            const vencimientoPago = new Date(pago.fechaVencimiento);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            setUltimoPago(pago);

            if (vencimientoPago >= hoy) {
              fechaBase = vencimientoPago;
            } else {
              fechaBase = hoy;
            }
          } else {
            setUltimoPago(null);
          }
        } catch (error) {
          setUltimoPago(null);
        }

        let nuevaFecha = new Date(fechaBase);

        if (rangoPagoUnidad === 'dias') {
          nuevaFecha.setDate(nuevaFecha.getDate() + rango);
        } else if (rangoPagoUnidad === 'meses') {
          nuevaFecha.setMonth(nuevaFecha.getMonth() + rango);
        }

        nuevaFecha.setHours(0, 0, 0, 0);
        setFechaVencimiento(nuevaFecha);
      };

      calcularFechaVencimiento();
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [usuarioId, fechaPago, mesesPagados, rangoPagoUnidad]);

  if (!fechaVencimiento) return null;

  const formatFecha = (fechaStr) => {
    const date = new Date(fechaStr);
    return date.toLocaleDateString();
  };

  return (
    <Box mt={3} display="flex" justifyContent="center">
      <Card elevation={3} sx={{ maxWidth: 480, width: '100%', borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <EventAvailableIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Estado de Pago
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {ultimoPago ? (
                <>
                  <Typography variant="body1">
                    {new Date(ultimoPago.fechaVencimiento) >= new Date() ? (
                      <>
                        <strong>Último pago hasta:</strong> {formatFecha(ultimoPago.fechaVencimiento)}
                      </>
                    ) : (
                      <>
                        <strong>Venció el:</strong> {formatFecha(ultimoPago.fechaVencimiento)}
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado actual:{" "}
                    {new Date(ultimoPago.fechaVencimiento) >= new Date() ? (
                      <Chip label="Vigente" color="success" size="small" />
                    ) : (
                      <Chip label="Vencido" color="error" size="small" />
                    )}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay pago registrado.
                </Typography>
              )}
            </Box>

            <Box textAlign="center">
              <Typography variant="body1" fontWeight="bold">
                Nuevo Vencimiento
              </Typography>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {fechaVencimiento.toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default FechaVencimiento;