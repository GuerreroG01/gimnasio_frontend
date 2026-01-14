import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Badge } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMensajes } from '../../Context/MensajeContext';
import MensajeUsuario from './MensajeUsuario';
import MensajeSistema from './MensajeSistema';
import mensajeService from '../../Services/MensajeService';
const IndexMensajes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTabIndex = tabParam === 'sistema' ? 1 : 0;

  const [tabIndex, setTabIndex] = useState(initialTabIndex);

  const { noLeidos, marcarLeidos } = useMensajes();

  useEffect(() => {
    if (!tabParam) {
      setSearchParams({ tab: 'usuarios' });
    }
  }, [tabParam, setSearchParams]);

  // --- Marcar mensajes como leídos al cambiar de pestaña ---
  const handleChange = async (event, newIndex) => {
    setTabIndex(newIndex);
    const newTab = newIndex === 0 ? 'usuarios' : 'sistema';
    setSearchParams({ tab: newTab });

    try {
      if (newIndex === 0 && noLeidos.usuarios > 0) {
        const ids = await mensajeService.getIdsNoLeidosUsuarios();
        if (ids.length > 0) {
          await marcarLeidos('usuarios', ids);
        }
      }

      if (newIndex === 1 && noLeidos.sistema > 0) {
        const ids = await mensajeService.getIdsNoLeidosSistema();
        if (ids.length > 0) {
          await marcarLeidos('sistema', ids);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', marginTop: 1}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabIndex}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: 180 }}
      >
        <Tab
          label={
            <Badge
              badgeContent={noLeidos.usuarios}
              color="error"
              invisible={noLeidos.usuarios === 0}
              sx={{ '& .MuiBadge-badge': { right: -18 } }}
            >
              Usuarios
            </Badge>
          }
        />
        <Tab
          label={
            <Badge
              badgeContent={noLeidos.sistema}
              color="error"
              invisible={noLeidos.sistema === 0}
              sx={{ '& .MuiBadge-badge': { right: -18 } }}
            >
              Sistema
            </Badge>
          }
        />
      </Tabs>

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        {tabIndex === 0 && <MensajeUsuario />}
        {tabIndex === 1 && <MensajeSistema />}
      </Box>
    </Box>
  );
};
export default IndexMensajes;