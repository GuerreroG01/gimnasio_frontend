import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Chip, Divider, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import UpgradeIcon from '@mui/icons-material/ArrowUpward';

export default function UpgradeLicense({ open, onClose, currentPlan }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [selectedPlan, setSelectedPlan] = useState('');

    const handleWhatsApp = () => {
        if (!selectedPlan) return;

        const numero = window._env_ ? window._env_.REACT_APP_WHATSAPPDEV_NUMBER : process.env.REACT_APP_WHATSAPPDEV_NUMBER;
        const negocio = window._env_ ? window._env_.REACT_APP_NEGOCIO : process.env.REACT_APP_NEGOCIO || "System-Gym";

        const mensaje = encodeURIComponent(
            `Hola, quiero mejorar al plan ${selectedPlan} para el sistema en mi negocio ${negocio}. ¿Podrían proporcionarme más información sobre los planes disponibles y el proceso de actualización?`
        );

        window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
    };

    const plans = ['PRO', 'FULL'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: isDark ? '0 16px 32px rgba(0,0,0,0.8)' : '0 16px 32px rgba(0,0,0,0.15)',
                    bgcolor: isDark ? '#1e1e1e' : '#fafafa',
                    overflow: 'hidden',
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: isDark ? 'linear-gradient(90deg, #ff8a65, #ff5722)' : 'linear-gradient(90deg, #ffb74d, #ff7043)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.35rem',
                py: 2,
                px: 3,
                borderBottom: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
            }}>
                <LockIcon fontSize="medium" />
                Función no disponible
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 3 }}>
                <Typography variant="body1" sx={{ mb: 2, color: isDark ? '#e0e0e0' : '#333', fontSize: '1rem', lineHeight: 1.6 }}>
                    Esta funcionalidad está bloqueada en tu plan actual ({currentPlan}).
                </Typography>

                <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />

                <Typography variant="body2" sx={{ mb: 1, color: isDark ? '#bbb' : '#555', fontWeight: 500 }}>
                    Selecciona el plan al que quieres mejorar:
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                    {plans.map(plan => (
                        <Chip
                            key={plan}
                            label={plan}
                            clickable
                            onClick={() => setSelectedPlan(plan)}
                            sx={{
                                fontWeight: 'bold',
                                bgcolor: selectedPlan === plan ? (isDark ? '#ff7043' : '#2196f3') : (isDark ? '#555' : '#ddd'),
                                color: selectedPlan === plan ? '#fff' : (isDark ? '#ccc' : '#333'),
                                borderRadius: 2,
                                px: 2.5,
                                py: 0.5,
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: isDark ? '#ff5722' : '#1976d2' }
                            }}
                        />
                    ))}
                </Box>

                <Typography variant="body2" sx={{ color: isDark ? '#ccc' : '#555', fontSize: '0.9rem' }}>
                    Para desbloquear esta funcionalidad, contacta con el desarrollador.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    sx={{
                        textTransform: 'none',
                        color: isDark ? '#aaa' : '#555',
                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
                        fontWeight: 500,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Más tarde
                </Button>
                <Button
                    variant="contained"
                    startIcon={<UpgradeIcon />}
                    onClick={handleWhatsApp}
                    disabled={!selectedPlan} // Bloquea botón si no hay plan
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                        py: 1.2,
                        opacity: !selectedPlan ? 0.6 : 1,
                        boxShadow: isDark ? '0 6px 16px rgba(255,87,34,0.3)' : '0 6px 16px rgba(25,118,210,0.25)',
                        background: selectedPlan
                            ? (isDark ? 'linear-gradient(45deg, #ff7043, #ff5722)' : 'linear-gradient(45deg, #2196f3, #1976d2)')
                            : (isDark ? '#555' : '#ddd'),
                        '&:hover': { boxShadow: selectedPlan ? '0 8px 20px rgba(0,0,0,0.2)' : 'none' },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Solicitar ahora
                </Button>
            </DialogActions>
        </Dialog>
    );
}