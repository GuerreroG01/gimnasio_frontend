import React, { createContext, useEffect } from 'react';
import AuthService from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = React.useState(false);
    const [usuario, setUsuario] = React.useState(null);
    const [userId, setUserId] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUsuario(decodedToken.sub);
                    setUserId(decodedToken.id);
                    setToken(token);
                    setAuthenticated(true);
                } catch (error) {
                    console.error('Token inválido o expirado', error);
                    setAuthenticated(false);
                    setToken(null);
                    setUsuario(null);
                    setUserId(null);
                    localStorage.removeItem('token');
                }
            } else {
                setAuthenticated(false);
                setToken(null);
                setUsuario(null);
                setUserId(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const [statusPage, setStatusPage] = React.useState(() => {
        const saved = localStorage.getItem('statusPage');
        return saved === 'public' || saved === 'private' ? saved : 'public';
    });

    useEffect(() => {
        localStorage.setItem('statusPage', statusPage);
    }, [statusPage]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response  = await AuthService.PostLogin(credentials);
            if (!response.token || typeof response.token !== 'string') {
                throw new Error('Token no recibido o inválido');
            }
            const token = response.token;
            localStorage.setItem('token', token);
            const decodedToken = jwtDecode(token);
            setUsuario(decodedToken.sub);
            setUserId(decodedToken.id);
            setToken(token);
            setAuthenticated(true);
            setStatusPage('private');
            return true;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setAuthenticated(false);
            setToken(null);
            setUsuario(null);
            setUserId(null);
            localStorage.removeItem('token');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthenticated(false);
        setUsuario(null);
        setUserId(null);
        setToken(null);
        setStatusPage('public');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authenticated, usuario, userId, token, login, logout, loading, statusPage, setStatusPage }}>
            {children}
        </AuthContext.Provider>
    );
};