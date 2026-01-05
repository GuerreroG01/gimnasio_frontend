import React, {useEffect, useCallback} from 'react';
import { Grid, Card, Typography, Avatar, Chip, LinearProgress  } from '@mui/material';
import { format } from 'date-fns';
import Desconocido from '../../assets/Images/Desconocido.png';
import { es } from 'date-fns/locale';
import { differenceInMonths, differenceInDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import alertaAudio from '../../assets/Audio/alarma.wav';
import vigenteAudio from '../../assets/Audio/Vigente.mp3';

const InfoUsuario = ({ cliente }) => {
  const calcularDiasRestantes = useCallback((fechaVencimiento) => {
    const fechaActual = new Date();
    const vencimiento = new Date(fechaVencimiento);
  
    if (isNaN(vencimiento.getTime())) {
      return 'Fecha inválida';
    }
  
    const diferencia = vencimiento - fechaActual;
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
  
    if (diasRestantes < 0) {
      const monthsPassed = Math.abs(differenceInMonths(fechaActual, vencimiento));
      const daysPassed = Math.abs(differenceInDays(fechaActual, vencimiento) - monthsPassed * 30);
  
      if (monthsPassed === 0) {
        return `Hace ${daysPassed} días expiró`;
      }
      return `Hace ${monthsPassed} meses y ${daysPassed} días expiró`;
    }
  
    const monthsRemaining = Math.floor(differenceInMonths(vencimiento, fechaActual));
    const daysRemaining = Math.abs(differenceInDays(vencimiento, fechaActual) - monthsRemaining * 30);
  
    if (monthsRemaining === 0) {
      return `${daysRemaining} días restantes`;
    }
    return `${monthsRemaining} meses y ${daysRemaining} días restantes`;
  }, []);  
  const calculoparaprogreso = (fechaVencimiento) => {
    const fechaActual = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - fechaActual;
    
    if (diferencia < 0) {
      return -1;
    }
    
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
    
    return diasRestantes;
  };  
  const obtenerColorProgreso = (fechaVencimiento) => {
    const diasRestantes = calculoparaprogreso(fechaVencimiento);
  
    if (diasRestantes === -1) {
      return 'error';
    }
  
    if (diasRestantes <= 3 && diasRestantes > 0) {
      return 'warning';
    } else if (diasRestantes > 3) {
      return 'success';
    }
  
    return 'error';
  };
  
  const calcularProgreso = (fechaVencimiento) => {
    const fechaActual = new Date();
    const vencimiento = new Date(fechaVencimiento);
  
    const diasTotales = Math.ceil((vencimiento - fechaActual) / (1000 * 3600 * 24));
    const diasTranscurridos = Math.ceil((fechaActual - new Date(cliente.ultimoPago.fechaPago)) / (1000 * 3600 * 24));
  
    if (diasTotales <= 0) {
      return 100;
    }
  
    const porcentajeProgreso = Math.min((diasTranscurridos / diasTotales) * 100, 100);
    return porcentajeProgreso;
  };    

  const formatDate = (date) => {
    if (!date) return 'No proporcionado';
    const zonedDate = toZonedTime(new Date(date), 'America/Managua');
    return format(zonedDate, 'dd MMMM yyyy', { locale: es });
  };

  const estadoPago = useCallback((fechaVencimiento) => {
    const diasRestantes = calcularDiasRestantes(fechaVencimiento);
    
    if (diasRestantes.includes("expiró")) {
      return 'Expirado';
    }
  
    return 'Vigente';
  }, [calcularDiasRestantes]);  
  const reproducirAudio = (estado) => {
    const audio = new Audio(estado === 'Vigente' ? vigenteAudio : alertaAudio);
    audio.play();
  };
  useEffect(() => {
    if (cliente?.ultimoTiempoPago) {
      const estado = estadoPago(cliente.ultimoTiempoPago.fechaVencimiento);
      reproducirAudio(estado);
    }
  }, [cliente, estadoPago]);
  const API_IMAGES = (window._env_ ? window._env_.REACT_APP_IMAGE_URL : process.env.REACT_APP_IMAGE_URL);
  const imageURL = cliente?.cliente?.foto ? `${API_IMAGES}/${cliente.cliente.foto}` : Desconocido;
  
  return (
    <>
      {cliente && cliente.cliente ? (
        <>
        <Grid container spacing={3} alignItems="flex-start" direction="row" wrap="nowrap">
          <Grid item xs={12} sm={5} md={4}>
            <Card 
              sx={{ 
                padding: 3, 
                borderRadius: 2, 
                boxShadow: 3, 
                backgroundColor: '#fff',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 6 }
              }}
            >
              <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item>
                <Avatar
                  alt={`${cliente.cliente.nombres} ${cliente.cliente.apellidos}`}
                  src={imageURL}
                  sx={{ width: 130, height: 130, marginBottom: 2, boxShadow: 3 }}
                />
                </Grid>
                <Grid item>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {cliente.cliente.nombres} {cliente.cliente.apellidos}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'gray' }}>
                    Código: {cliente.cliente.codigo}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} sm={7} md={8}>
            <Card 
              sx={{ 
                padding: 3, 
                borderRadius: 2, 
                boxShadow: 3, 
                backgroundColor: '#fff',
                transition: 'all 0.3s ease', 
                '&:hover': { boxShadow: 6 }
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Información de Pagos
              </Typography>
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} sm={12} md={4}>
                  <Card 
                    sx={{ 
                      padding: 2, 
                      borderRadius: 2, 
                      boxShadow: 2, 
                      backgroundColor: '#f5f5f5',
                      transition: 'all 0.3s ease', 
                      '&:hover': { boxShadow: 4 } 
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Último Pago
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {cliente.ultimoPago ? formatDate(cliente.ultimoPago.fechaPago) : 'No registrado'}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Card 
                    sx={{ 
                      padding: 2, 
                      borderRadius: 2, 
                      boxShadow: 2, 
                      backgroundColor: '#f5f5f5',
                      transition: 'all 0.3s ease', 
                      '&:hover': { boxShadow: 4 } 
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Monto del Pago
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {cliente.ultimoPago ? `$${cliente.ultimoPago.monto}` : 'No disponible'}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Card 
                    sx={{ 
                      padding: 2, 
                      borderRadius: 2, 
                      boxShadow: 2, 
                      backgroundColor: '#f5f5f5',
                      transition: 'all 0.3s ease', 
                      '&:hover': { boxShadow: 4 } 
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Tiempo de Pago
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {cliente.ultimoPago && cliente.ultimoPago.intervaloPago ? 'Meses' : 'Días'}
                    </Typography>
                  </Card>
                </Grid>

                {cliente.ultimoPago && (cliente.ultimoPago.mesesPagados || cliente.ultimoPago.mesesPagados === 0) && (
                  <Grid item xs={12} sm={12} md={4}>
                    <Card 
                      sx={{ 
                        padding: 2, 
                        borderRadius: 2, 
                        boxShadow: 2, 
                        backgroundColor: '#f5f5f5',
                        transition: 'all 0.3s ease', 
                        '&:hover': { boxShadow: 4 } 
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {cliente.ultimoPago.intervaloPago ? 'Meses Pagados' : 'Días Pagados'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'gray' }}>
                        {cliente.ultimoPago.mesesPagados} {cliente.ultimoPago.intervaloPago ? 'meses' : 'días'}
                      </Typography>
                    </Card>
                  </Grid>
                )}

                {cliente.ultimoPago?.detallePago && 
                  cliente.ultimoPago?.detallePago.trim().toLowerCase() !== 'sin comentario' && 
                  cliente.ultimoPago?.detallePago !== '0' && 
                  cliente.ultimoPago?.detallePago !== 0 && (
                    <Grid item xs={12} sm={12} md={4}>
                      <Card 
                        sx={{ 
                          padding: 2, 
                          borderRadius: 2, 
                          boxShadow: 2, 
                          backgroundColor: '#f5f5f5',
                          transition: 'all 0.3s ease', 
                          '&:hover': { boxShadow: 4 } 
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Detalle del Pago
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'gray' }}>
                          {cliente.ultimoPago.detallePago}
                        </Typography>
                      </Card>
                    </Grid>
                )}

                <Grid item xs={12} sm={12} md={4}>
                  <Card 
                    sx={{ 
                      padding: 2, 
                      borderRadius: 2, 
                      boxShadow: 2, 
                      backgroundColor: '#f5f5f5',
                      transition: 'all 0.3s ease', 
                      '&:hover': { boxShadow: 4 } 
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Fecha de Vencimiento
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {cliente.ultimoTiempoPago ? formatDate(cliente.ultimoTiempoPago.fechaVencimiento) : 'No disponible'}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={4}>
                  <Card 
                    sx={{ 
                      padding: 1,
                      borderRadius: 2, 
                      boxShadow: 2, 
                      backgroundColor: '#f5f5f5', 
                      position: 'relative', 
                      width: '100%',
                      minWidth: 160,
                      height: 'auto',
                      transition: 'all 0.3s ease', 
                      '&:hover': { boxShadow: 4 } 
                    }}
                  >
                    <Chip
                      label={cliente.ultimoTiempoPago ? estadoPago(cliente.ultimoTiempoPago.fechaVencimiento) : 'No disponible'}
                      color={cliente.ultimoTiempoPago && estadoPago(cliente.ultimoTiempoPago.fechaVencimiento) === 'Vigente' ? 'success' : 'error'}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        position: 'absolute',
                        top: 4,
                        right: 4,
                      }}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      Estado de Pago
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray', marginTop: 1 }}>
                      {cliente.ultimoTiempoPago ? calcularDiasRestantes(cliente.ultimoTiempoPago.fechaVencimiento) : 'No disponible'}
                    </Typography>

                    {cliente.ultimoTiempoPago && (
                      <LinearProgress 
                        sx={{ 
                          marginTop: 1,
                          height: 4,
                          borderRadius: 1 
                        }} 
                        variant="determinate" 
                        value={calcularProgreso(cliente.ultimoTiempoPago.fechaVencimiento)} 
                        color={obtenerColorProgreso(cliente.ultimoTiempoPago.fechaVencimiento)}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
        </>
      ) : (
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'gray' }}>
          No se encontraron asistencias para el usuario ingresado.
        </Typography>
      )}
    </>
  );
};
export default InfoUsuario;