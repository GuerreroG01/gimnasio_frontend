import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, useTheme, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './DetalleCliente.css';

const Item = ({ label, value, color }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      p: 1,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      minWidth: 140,
      flex: 1,
      mb: 1,
      backgroundColor: 'background.paper'
    }}
  >
    <Typography variant="caption" color="text.secondary" noWrap>
      {label}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        fontWeight: 600,
        color: color || 'text.primary',
        wordBreak: 'break-word'
      }}
    >
      {value || '—'}
    </Typography>
  </Box>
);

const DetalleCliente = ({ imageUrl, cliente, id, navigate, telefonoMostrar, estadoCliente, formatDate,
  handleAddFecha, formatMonthYear, calculateProgress, getColorBasedOnDate }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Detalles
      </Typography>

      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          mb: 3,
          borderRadius: 3,
          boxShadow: 3
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl || '/no-image.png'}
          alt="Foto del Cliente"
          sx={{
            width: { xs: '100%', md: 220 },
            height: { xs: 220, md: 'auto' },
            objectFit: 'cover'
          }}
        />

        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {cliente.nombres} {cliente.apellidos}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Código: {cliente.codigo}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Item label="Teléfono" value={telefonoMostrar} />
            <Item label="Correo" value={cliente.correo} />
            <Item
              label="Fecha Ingreso"
              value={formatDate(cliente.fechaIngreso)}
            />
            <Item
              label="Género"
              value={
                cliente.genero === 'M'
                  ? 'Masculino'
                  : cliente.genero === 'F'
                  ? 'Femenino'
                  : 'Otro'
              }
            />
            <Item label="Nivel" value={cliente.nivelActual} />
            <Item
              label="Estado"
              value={estadoCliente}
              color={
                estadoCliente === 'Activo'
                  ? 'success.main'
                  : 'error.main'
              }
            />
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="text.secondary">
            Observaciones
          </Typography>
          <Typography variant="body2">
            {cliente.observaciones || 'Sin observaciones'}
          </Typography>
        </CardContent>
      </Card>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        Pagos Asociados
      </Typography>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
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
          {cliente.TiempoPago.map((fecha) => (
            <Grid item xs={12} sm={6} md={4} key={fecha.id}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pago {formatMonthYear(fecha.fechaPago)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Código: {fecha.codigoPago}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Fecha Pago: {formatDate(fecha.fechaPago)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Vence: {formatDate(fecha.fechaVencimiento)}
                  </Typography>
                </CardContent>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 6,
                    backgroundColor: 'grey.300'
                  }}
                >
                  <Box
                    sx={{
                      width: `${calculateProgress(
                        fecha.fechaPago,
                        fecha.fechaVencimiento
                      )}%`,
                      height: '100%',
                      backgroundColor: getColorBasedOnDate(
                        fecha.fechaPago,
                        fecha.fechaVencimiento,
                        theme
                      ),
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
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