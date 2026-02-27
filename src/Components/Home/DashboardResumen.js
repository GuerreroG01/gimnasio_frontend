import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Chip, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventIcon from '@mui/icons-material/Event';
import ConsolidadoService from "../../Services/ConsolidadoService";

const indicadores = [
  { key: 'usuariosActivos', label: 'Usuarios activos', icon: <PeopleIcon />, valueKey: 'clientes', diffKey: 'clientesDiffPercent', refText: 'respecto al mes anterior', isPercent: true, isDecimal: false, color: '#1976d2' },
  { key: 'ingresosDiaUSD', label: 'Ingresos del día (USD)', icon: <AttachMoneyIcon />, valuePath: ['ingresos', 'totalUSD'], diffPath: ['ingresosDiff', 'totalUSD'], prefix: '$', refText: 'respecto a ayer', isDecimal: true, color: '#2e7d32' },
  { key: 'ingresosDiaNIO', label: 'Ingresos del día (NIO)', icon: <AttachMoneyIcon />, valuePath: ['ingresos', 'totalNIO'], diffPath: ['ingresosDiff', 'totalNIO'], prefix: 'C$', refText: 'respecto a ayer', isDecimal: true, color: '#fbc02d' },
  { key: 'ventasProductos', label: 'Ventas de productos', icon: <ShoppingCartIcon />, valueKey: 'ventas', diffKey: 'ventasDiff', refText: 'respecto a ayer', isDecimal: false, color: '#0288d1' },
  { key: 'asistenciasHoy', label: 'Asistencias hoy', icon: <EventIcon />, valueKey: 'asistencias', diffKey: 'asistenciasDiff', refText: 'respecto a ayer', isDecimal: false, color: '#9c27b0' }
];

export default function DashboardResumen() {
  const theme = useTheme();
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
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {indicadores.map((item) => {
        const valor = item.valuePath
          ? item.valuePath.reduce((acc, key) => acc?.[key], datos)
          : datos[item.valueKey];

        const diferencia = item.diffPath
          ? item.diffPath.reduce((acc, key) => acc?.[key], datos)
          : datos[item.diffKey];

        const esPositivo = diferencia >= 0;

        const bgGradient = theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${item.color}66 0%, ${item.color}33 100%)`
          : `linear-gradient(135deg, ${item.color}33 0%, ${item.color}1A 100%)`;

        const chipBg = esPositivo
          ? theme.palette.mode === 'dark' ? '#2e7d3233' : '#c8e6c9'
          : theme.palette.mode === 'dark' ? '#c6282833' : '#ffcdd2';

        const chipColor = esPositivo
          ? theme.palette.mode === 'dark' ? '#a5d6a7' : '#2e7d32'
          : theme.palette.mode === 'dark' ? '#ef9a9a' : '#c62828';

        return (
          <Grid item key={item.key} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2, 
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.02)', boxShadow: 4 },
                background: bgGradient
              }}
            >
              <Box 
                display="flex" 
                alignItems="center" 
                mb={1} 
                flexWrap="wrap"
              >
                <Box 
                  sx={{ 
                    width: { xs: 35, sm: 40 }, 
                    height: { xs: 35, sm: 40 }, 
                    borderRadius: '50%', 
                    backgroundColor: item.color, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    color: '#fff',
                    mr: 1.5,
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  {item.icon}
                </Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold" 
                  color="text.primary"
                  sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
                >
                  {item.label}
                </Typography>
              </Box>

              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="text.primary"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                {item.prefix}
                {item.isDecimal
                  ? Number(valor).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : Number(valor).toLocaleString('es-NI', { maximumFractionDigits: 0 })
                }
              </Typography>

              <Box display="flex" alignItems="center" mt={0.8} flexWrap="wrap">
                <Chip
                  icon={esPositivo ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>}
                  label={item.isPercent
                    ? `${Math.abs(diferencia).toFixed(2)}%`
                    : item.isDecimal
                      ? `${item.prefix || ''}${Math.abs(diferencia).toFixed(2)}`
                      : `${item.prefix || ''}${Math.abs(diferencia).toLocaleString('es-NI', { maximumFractionDigits: 0 })}`
                  }
                  size="small"
                  sx={{
                    backgroundColor: chipBg,
                    color: chipColor,
                    fontWeight: 'bold',
                    mr: 1,
                    mb: { xs: 0.5, sm: 0 }
                  }}
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                >
                  {item.refText}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}