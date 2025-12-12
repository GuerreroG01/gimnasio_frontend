import React, { createContext, useEffect } from 'react';
import AuthService from '../Services/AuthService';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = React.useState(false);
    const [usuario, setUsuario] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
            const decodedToken = jwtDecode(token);
            setUsuario(decodedToken.sub);
            setToken(token);
            setAuthenticated(true);
            } catch (error) {
            console.error('Token inválido o expirado', error);
            setAuthenticated(false);
            setToken(null);
            localStorage.removeItem('token');
            }
        } else {
            setAuthenticated(false);
            setToken(null);
        }
        setLoading(false);
        };
        checkAuth();
    }, []);

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
            setToken(token);
            setAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setAuthenticated(false);
            setToken(null);
            localStorage.removeItem('token');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAuthenticated(false);
        setUsuario(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ authenticated, usuario, token, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    );
};