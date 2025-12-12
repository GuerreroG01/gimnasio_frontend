// DashboardResumen.js
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import ConsolidadoService from "../../Services/ConsolidadoService";
const indicadores = [
  {
    key: 'usuariosActivos',
    label: 'Usuarios activos',
    icon: <PeopleIcon color="primary" />,
    valueKey: 'usuarios',
    diffKey: 'usuariosDiff',
    refText: 'respecto al mes anterior'
  },
  {
    key: 'ingresosDia',
    label: 'Ingresos del día',
    icon: <AttachMoneyIcon sx={{ color: '#fbc02d' }} />,
    valueKey: 'ingresos',
    diffKey: 'ingresosDiff',
    refText: 'respecto a ayer',
    prefix: 'C$'
  },
  {
    key: 'ventasProductos',
    label: 'Ventas de productos',
    icon: <ShoppingCartIcon color="info" />,
    valueKey: 'ventas',
    diffKey: 'ventasDiff',
    refText: 'respecto a la semana pasada'
  },
  {
    key: 'asistenciasHoy',
    label: 'Asistencias hoy',
    icon: <EventIcon sx={{ color: '#ab47bc' }} />,
    valueKey: 'asistencias',
    diffKey: 'asistenciasDiff',
    refText: 'respecto a ayer'
  }
];

export default function DashboardResumen() {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ConsolidadoService.getDatosResumen();
        setDatos(data);
      } catch (error) {
        console.error("Error al obtener datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !datos) return <div>Cargando...</div>;

  return (
    <Grid container spacing={2}>
      {indicadores.map((item) => {
        const valor = datos[item.valueKey];
        const diferencia = datos[item.diffKey];
        const esPositivo = diferencia >= 0;

        return (
          <Grid item xs={12} md={6} lg={3} key={item.key}>
            <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {item.icon}
                <Typography variant="subtitle2">{item.label}</Typography>
              </Box>
              <Typography variant="h5">
                {item.prefix || ''}{valor}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                {esPositivo ? (
                  <ArrowUpwardIcon color="success" fontSize="small" />
                ) : (
                  <ArrowDownwardIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={esPositivo ? 'green' : 'red'}
                  ml={0.5}
                >
                  {Math.abs(diferencia)}% {item.refText}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
