import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Navegacion from '../Navegacion/Navegacion';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children, optional = false }) => {
    const { authenticated, loading } = React.useContext(AuthContext);

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

    if (!authenticated) {
        if (optional) {
            return <>{children}</>;
        }

        return <Navigate to="/login" replace />;
    }

    return <Navegacion>{children}</Navegacion>;
};

export default PrivateRoute;