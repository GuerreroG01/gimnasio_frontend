import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import mensajeService from '../Services/MensajeService';
import AuthService from '../Services/AuthService';

const MensajeContext = createContext();
export const useMensajes = () => useContext(MensajeContext);

export const MensajeProvider = ({ children }) => {
  const [noLeidos, setNoLeidos] = useState({ usuarios: 0, sistema: 0 });
  const connectionRef = useRef(null);

  // URL del backend configurable
  const BACKEND_URL = window._env_?.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL;

  // Función para marcar mensajes como leídos
  const marcarLeidos = useCallback(async (tipo, ids) => {
    if (!ids || ids.length === 0) return;
    try {
      await mensajeService.marcarMensajesLeidos(ids);
      setNoLeidos(prev => ({ ...prev, [tipo]: 0 }));
      console.log(`[marcarLeidos] Mensajes de tipo "${tipo}" marcados como leídos:`, ids);
    } catch (error) {
      console.error('[marcarLeidos] Error al marcar mensajes como leídos:', error);
    }
  }, []);

  useEffect(() => {
    const cargarNoLeidos = async () => {
      try {
        const data = await mensajeService.getNoLeidosMensajes();

        setNoLeidos({
          usuarios: data?.usuarios?.total ?? 0,
          sistema: data?.sistema?.total ?? 0,
        });

        console.log('[Mensajes] Estado inicial cargado:', data);
      } catch (error) {
        console.error('[Mensajes] Error al cargar no leídos:', error);
      }
    };

    cargarNoLeidos();
  }, []);

  useEffect(() => {
    const token = AuthService.getToken();
    if (!token) {
      console.warn('[Hub] No se encontró token de autenticación. No se conectará al hub.');
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(`${BACKEND_URL.replace(/\/$/, '')}/hubs/sistema`, { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    // Manejo de mensajes de usuarios
    connection.on('MensajeUsuarios', (data) => {
      const cantidad = typeof data === 'number' ? data : data?.cantidad || 0;
      console.log('[Hub] MensajeUsuarios recibido:', data, '-> cantidad procesada:', cantidad);
      setNoLeidos(prev => ({ ...prev, usuarios: cantidad }));
    });

    // Manejo de mensajes del sistema
    connection.on('MensajeSistema', (data) => {
      const cantidad = typeof data === 'number' ? data : data?.cantidad || 0;
      console.log('[Hub] MensajeSistema recibido:', data, '-> cantidad procesada:', cantidad);
      setNoLeidos(prev => ({ ...prev, sistema: cantidad }));
    });

    // Manejo de cierre de conexión
    connection.onclose((error) => {
      if (error) console.error('[Hub] Conexión cerrada con error:', error);
      else console.log('[Hub] Conexión cerrada correctamente.');
    });

    // Iniciar la conexión
    connection.start()
      .then(() => console.log('[Hub] Conectado al hub de sistema'))
      .catch(err => console.error('[Hub] Error al conectar al hub:', err));

    connectionRef.current = connection;

    // Cleanup al desmontar
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop()
          .then(() => console.log('[Hub] Conexión al hub detenida'))
          .catch(err => console.error('[Hub] Error al detener la conexión:', err));
      }
    };
  }, [BACKEND_URL]);

  return (
    <MensajeContext.Provider value={{ noLeidos, marcarLeidos }}>
      {children}
    </MensajeContext.Provider>
  );
};