import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Navegacion from '../Navegacion/Navegacion';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children, optional = false, allowedRoles = [] }) => {
    const { authenticated, loading, rol, statusPage } = React.useContext(AuthContext);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Usuario no autenticado
    if (!authenticated) {
        if (optional) return <>{children}</>;
        if (statusPage === 'private') return <Navigate to="/login" replace />;
        return <>{children}</>;
    }

    // Validar rol
    if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
        // Si el usuario no tiene permisos
        return <Navigate to="/unauthorized" replace />; // Puedes crear esta página
    }

    return <Navegacion>{children}</Navegacion>;
};

export default PrivateRoute;