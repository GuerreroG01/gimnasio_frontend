import { useContext } from 'react';
import { Typography, Paper, Box, Divider } from '@mui/material';
import ConfigBackup from './Backup/ConfigBackup';
import ConfigInactividad from './Inactivos/ConfigInactividad';
import InfoUser from '../User/InfoUser';
import License from './License/License';
import { AuthContext } from '../../Context/AuthContext';

const Configuraciones = () => {
    const { rol, plan } =useContext(AuthContext);
    const isSuperAdmin = rol === "SuperAdmin";
    const isAdminFullOrPro = rol === "Admin" && ["FULL", "PRO"].includes(plan?.toUpperCase());
    const permitido = isSuperAdmin || isAdminFullOrPro;
    const isFull = isSuperAdmin || (rol === "Admin" && plan?.toUpperCase() === "FULL");
    return (
        <Box sx={{ width:"100%", mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <InfoUser />
            </Box>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        sx={{ fontWeight: 'bold', color: 'primary.main', textAlign: 'center' }}
                    >
                        Panel de Configuraciones
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ mb: 4 }}>
                        <License />
                    </Box>
                    {permitido && (
                        <>
                            {isSuperAdmin && (
                                <Box sx={{ mb: 5 }}>
                                    <ConfigBackup />
                                </Box>  
                            )}

                            <Divider sx={{ mb: 4 }} />

                            <Box>
                                <ConfigInactividad
                                    permitido={isFull}
                                />
                            </Box>
                        </>
                    )}
                </Paper>
        </Box>
    );
};
export default Configuraciones;