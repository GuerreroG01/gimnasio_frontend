import React, { useEffect } from 'react';
import {
  Box, Container, Typography, Paper, TextField,
  Checkbox, CircularProgress, Alert, Stack, Divider,
  MenuItem
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfigSistemService from '../../../Services/ConfigSistemService';

const ConfigInactividad = () => {
  const [config, setConfig] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [mensaje, setMensaje] = React.useState(null);
  const [cambiosPendientes, setCambiosPendientes] = React.useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await ConfigSistemService.getConfig();
        if (Array.isArray(data) && data.length > 0) {
          const configFiltrada = data.filter(c =>
            c.id === 1 || c.id === 2
          );
          setConfig(configFiltrada);
        } else {
          // Si data es null o vacío
          setConfig([]);
          setMensaje({ tipo: 'info', texto: 'No hay configuración disponible.' });
        }
      } catch (error) {
        setMensaje({ tipo: 'error', texto: 'Error al obtener configuración.' });
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (!loading && cambiosPendientes && config.length > 0) {
      const guardarConfig = async () => {
        try {
          for (const conf of config) {
            await ConfigSistemService.updateConfig(conf);
          }
          setMensaje({ tipo: 'success', texto: 'Configuración actualizada correctamente.' });
          setCambiosPendientes(false);
        } catch (error) {
          setMensaje({ tipo: 'error', texto: 'Error al actualizar la configuración.' });
        }
      };
      guardarConfig();
    }
  }, [config, cambiosPendientes, loading]);

  useEffect(() => {
    if (mensaje) {
      const timeout = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje]);

  const handleValorChange = (e, id) => {
    const valor = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setConfig(prev => prev.map(c => c.id === id ? { ...c, valor } : c));
    setCambiosPendientes(true);
  };

  const handleEstadoChange = (e, id) => {
    const estado = e.target.checked;
    setConfig(prev => prev.map(c => c.id === id ? { ...c, estado } : c));
    setCambiosPendientes(true);
  };

  const opcionesMeses = [1, 3, 6, 9, 12];

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando configuración
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <AccessTimeIcon />
          Configuración de Inactividad
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {config.length === 0 ? (
          <Alert severity="info">No hay configuraciones disponibles para mostrar.</Alert>
        ) : (
          <Stack spacing={3}>
            {config.map(conf => {
              const estaInactivo = !conf.estado;
              return (
                <Box
                  key={conf.id}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    justifyContent: 'space-between',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: estaInactivo ? '#f0f0f0' : '#ffffff',
                    opacity: estaInactivo ? 0.6 : 1,
                    transition: 'background-color 0.3s, opacity 0.3s',
                  }}
                >
                  <Box sx={{ flex: 1, pr: { md: 2 } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {conf.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Estado: <strong>{conf.estado ? 'Activo' : 'Inactivo'}</strong>
                    </Typography>

                    {conf.id === 1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <TextField
                          select
                          label="Meses"
                          size="small"
                          value={conf.valor !== undefined ? conf.valor : ''}
                          onChange={(e) => handleValorChange(e, conf.id)}
                          variant="filled"
                          disabled={estaInactivo}
                          sx={{
                            width: '100px',
                            '& .MuiFilledInput-root': {
                              borderRadius: 2,
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          {opcionesMeses.map(opcion => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    )}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: { xs: 2, md: 0 } }}>
                    <Checkbox
                      checked={!!conf.estado}
                      onChange={(e) => handleEstadoChange(e, conf.id)}
                      size="small"
                    />
                    <Typography variant="body2">Activo</Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}

        {mensaje && (
          <Alert severity={mensaje.tipo} sx={{ mt: 3 }}>
            {mensaje.texto}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
export default ConfigInactividad;