import {
  Box, Typography, Button, Card, CardContent, CardMedia, Grid, useTheme, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './DetalleCliente.css';

const DetalleCliente = ({ imageUrl, cliente, id, navigate, telefonoMostrar, estadoCliente, formatDate, handleAddFecha, formatMonthYear, calculateProgress, getColorBasedOnDate }) => {
  const theme = useTheme();
  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ color: (theme) => theme.palette.text.primary }}>
        Detalles
      </Typography>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', sm: '200px' }, height: { xs: 'auto', sm: '200px' }, objectFit: 'contain' }}
          image={imageUrl}
          alt="Foto del Cliente"
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" gutterBottom>
            <strong>Código:</strong> {cliente.codigo}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <strong>Cliente:</strong> {cliente.nombres} {cliente.apellidos}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Teléfono:</strong> {telefonoMostrar}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Correo Electrónico:</strong> {cliente.correo}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Estado:</strong> {estadoCliente}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Fecha de Ingreso:</strong> {formatDate(cliente.fechaIngreso)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1"><strong>Observaciones:</strong> {cliente.observaciones}</Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom sx={{ color: (theme) => theme.palette.text.primary }}>
        Pagos Asociados
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddFecha}
        >
          Agregar Pago
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/clientes/${id}/update`)}
        >
          Editar
        </Button>
      </Box>

      {cliente.TiempoPago && cliente.TiempoPago.length > 0 ? (
        <Grid container spacing={2}>
          {cliente.TiempoPago.map(fecha => (
            <Grid item xs={12} sm={6} md={4} key={fecha.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', p: 2, position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pago {formatMonthYear(fecha.fechaPago)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Codigo del Pago: {fecha.codigoPago}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha Pago: {formatDate(fecha.fechaPago)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha Vencimiento: {formatDate(fecha.fechaVencimiento)}
                  </Typography>
                </CardContent>

                <div
                  className="linearProgressFill"
                  style={{
                    height: `${calculateProgress(fecha.fechaPago, fecha.fechaVencimiento)}%`,
                    backgroundColor: getColorBasedOnDate(
                      fecha.fechaPago,
                      fecha.fechaVencimiento,
                      theme
                    ),
                  }}

                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Sin Fechas Ingresadas
        </Typography>
      )}
    </Box>
  );
};

export default DetalleCliente;