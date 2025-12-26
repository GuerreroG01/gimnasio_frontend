import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const ExistenciasContext = createContext();

export const ExistenciasProvider = ({ children }) => {
    const [existencias, setExistencias] = useState({});
    const connectionRef = useRef(null);
    const BACKEND_URL = (window._env_ ? window._env_.REACT_APP_BACKEND_URL : process.env.REACT_APP_BACKEND_URL);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`${BACKEND_URL}hubs/existenciasprod`)
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => console.log('Conectado a SignalR'))
            .catch((err) => console.error('Error conectando a SignalR:', err));

        connection.on('ActualizarExistencias', ({ modelo, id, nuevaExistencia }) => {
            if (!modelo || !id || typeof nuevaExistencia !== 'number') {
                console.warn('❗ Datos inválidos recibidos:', modelo, id, nuevaExistencia);
                return;
            }
            setExistencias((prev) => {
                const updated = {
                    ...prev,
                    [modelo]: {
                        ...prev[modelo],
                        [id]: nuevaExistencia,
                    },
                };
                return updated;
            });
        });

        connection.on('InicializarExistencias', (data) => {
            setExistencias(data);
        });

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [BACKEND_URL]);

    const inicializarExistencias = useCallback((modelo, items) => {
        setExistencias((prev) => {
            const updated = {
                ...prev,
                [modelo]: items.reduce((acc, item) => {
                    acc[item.id] = item.cantidad;
                    return acc;
                }, {}),
            };
            return updated;
        });
    }, []);

    return (
        <ExistenciasContext.Provider value={{ existencias, inicializarExistencias }}>
            {children}
        </ExistenciasContext.Provider>
    );
};
export const useExistencias = () => useContext(ExistenciasContext);