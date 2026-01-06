import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import ConfigBackup from './Backup/ConfigBackup';
//import ConfigInactividad from './Inactivos/ConfigInactividad';

const Configuraciones = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom 
                    sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}
                >
                    Panel de Configuraciones
                </Typography>

                <Divider sx={{ mb: 4 }} />

                <Box sx={{ mb: 5 }}>
                    <ConfigBackup />
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/*<Box>
                    <ConfigInactividad />
                </Box>*/}
            </Paper>
        </Container>
    );
};
export default Configuraciones;