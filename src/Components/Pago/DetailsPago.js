import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';

const DetailsPago = ({ open, onClose, pago, infopago }) => {
  console.log('InfoPago:', infopago);

  if (!infopago) return <Typography>Cargando información...</Typography>;

  const clienteNombre = pago.usuario ? pago.usuario.nombreCompleto : 'Cliente no encontrado';

  const fechaPago = new Date(pago.fechaPago);
  const mesesPagados = pago.intervaloPago ? `Meses Pagados: ${pago.mesesPagados}` : `Días Pagados: ${pago.mesesPagados}`;
  const monto = `Monto: $${pago.monto}`;
  const detallePago = `Detalle: ${pago.detallePago}`;

  const fechaVencimiento = infopago.fechasUsuario?.fechaVencimiento ? new Date(infopago.fechasUsuario.fechaVencimiento) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(5px)',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <Box 
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 3,
          boxShadow: 10,
          width: '400px',
          maxWidth: '100%',
          animation: 'fadeIn 0.3s ease-in-out',
          position: 'relative',
        }}
      >
        <IconButton 
          onClick={onClose} 
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ fontWeight: 'bold', color: 'primary.main' }}
        >
          Detalles del Pago
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {`Cliente: ${clienteNombre}`}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {`Fecha de Pago: ${fechaPago.getDate().toString().padStart(2, '0')} ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechaPago)} ${fechaPago.getFullYear()}`}
        </Typography>

        <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {mesesPagados}
        </Typography>

        <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {monto}
        </Typography>

        <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
          {detallePago}
        </Typography>

        {fechaVencimiento ? (
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
            {`Fecha de Vencimiento: ${fechaVencimiento.getDate().toString().padStart(2, '0')} ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(fechaVencimiento)} ${fechaVencimiento.getFullYear()}`}
          </Typography>
        ) : (
          <Typography variant="body1" gutterBottom sx={{ fontSize: '1rem', color: 'text.secondary' }}>
            {"Fecha de Vencimiento: Fecha inválida"}
          </Typography>
        )}

      </Box>
    </Modal>
  );
};
export default DetailsPago;