import React, { useEffect } from 'react';
import {
  Box, Container, Typography, Paper, TextField,
  Checkbox, CircularProgress, Stack, Divider,
  MenuItem, useTheme, IconButton, Popover
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ConfigSistemService from '../../../Services/ConfigSistemService';
import CustomSnackbar from '../../../Shared/Components/CustomSnackbar';

const ConfigInactividad = ({ permitido }) => {
  const [config, setConfig] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [mensaje, setMensaje] = React.useState(null);
  const [cambiosPendientes, setCambiosPendientes] = React.useState(false);
  const theme = useTheme();
  const [descripcionPopover, setDescripcionPopover] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await ConfigSistemService.getConfig();
        if (Array.isArray(data) && data.length > 0) {
          const configFiltrada = data.filter(c =>
            c.id === 1 || c.id === 2 || (c.id === 3 && permitido)
          );
          setConfig(configFiltrada);
        } else {
          setConfig([]);
          setMensaje({ severity: 'info', message: 'No hay configuración disponible.' });
        }
      } catch (error) {
        const backendMessage =
          error?.response?.data ||
          'Error al obtener configuración.';
        setMensaje({ severity: 'error', message: backendMessage + 'Contacte al desarrollador y active la licencia aqui.' });
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
          setMensaje({ severity: 'success', message: 'Configuración actualizada correctamente.' });
          setCambiosPendientes(false);
        } catch (error) {
          console.error('Error al actualizar configuración:', error);

          const backendMessage = error?.response?.data;
          if (backendMessage) {
            setMensaje({ severity: 'error', message: backendMessage });
          } else {
            setMensaje({ severity: 'error', message: 'Error al actualizar la configuración.' });
          }
        }
      };
      guardarConfig();
    }
  }, [config, cambiosPendientes, loading]);

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

  const handleInfoClick = (event, descripcion) => {
    setAnchorEl(event.currentTarget);
    setDescripcionPopover(descripcion);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setDescripcionPopover('');
  };

  const handleSnackbarClose = () => setMensaje(null);

  const openPopover = Boolean(anchorEl);

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
    <Box sx={{ width: '100%', mt: 4 }}>
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
          <Typography variant="body2" color="text.secondary">
            No hay configuraciones disponibles para mostrar.
          </Typography>
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
                    border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : '#e0e0e0'}`,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: estaInactivo
                      ? theme.palette.action.disabledBackground
                      : theme.palette.background.paper,
                    opacity: estaInactivo ? 0.6 : 1,
                    transition: 'background-color 0.3s, opacity 0.3s',
                  }}
                >
                  <Box sx={{ flex: 1, pr: { md: 2 } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {conf.nombre}
                      {conf.descripcion && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleInfoClick(e, conf.descripcion)}
                          sx={{ p: 0.5 }}
                        >
                          <InfoOutlinedIcon fontSize="small" color="action" />
                        </IconButton>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Estado: <strong>{conf.estado ? 'Activo' : 'Inactivo'}</strong>
                    </Typography>

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
                            backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
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
      </Paper>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="body2">{descripcionPopover}</Typography>
        </Box>
      </Popover>

      {mensaje && (
        <CustomSnackbar
          open={Boolean(mensaje)}
          message={mensaje.message}
          severity={mensaje.severity}
          onClose={handleSnackbarClose}
          autoHideDuration={3000}
        />
      )}
    </Box>
  );
};
export default ConfigInactividad;