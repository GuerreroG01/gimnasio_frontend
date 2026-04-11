import React from 'react';
import { Box, Typography, IconButton, Popover, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PagosResumen = ({ diaseleccionado, pagosDayData }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const diaData = pagosDayData?.find(
        (data) => data.dia === diaseleccionado
    );

    return (
        <Box>
            <Tooltip title="Ver resumen de pagos (Nicaragua)" arrow>
                <IconButton onClick={handleOpen} color="primary">
                    <PaymentIcon />
                </IconButton>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Box
                    sx={{
                        p: 0,
                        minWidth: 280,
                        borderRadius: 2,
                        overflow: 'hidden',
                        backgroundColor: isDark ? '#1e1e1e' : '#fff'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 2,
                            py: 1.2,
                            background: isDark
                                ? 'linear-gradient(90deg, #1565c0, #1e88e5)'
                                : 'linear-gradient(90deg, #1976d2, #42a5f5)',
                            color: 'white'
                        }}
                    >
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                            Resumen de pagos
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Día: {diaseleccionado}
                        </Typography>
                    </Box>

                    {/* Content */}
                    <Box sx={{ p: 1.5 }}>
                        {diaData ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>

                                {/* Pagos realizados */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        backgroundColor: isDark ? '#2a2a2a' : '#f5f7ff'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PaymentIcon fontSize="small" color="primary" />
                                        <Typography variant="body2" fontWeight={600}>
                                            Pagos
                                        </Typography>
                                    </Box>

                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            color: isDark ? '#90caf9' : '#1976d2'
                                        }}
                                    >
                                        {diaData.pagosRealizados}
                                    </Typography>
                                </Box>

                                {/* Total NIO */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        backgroundColor: isDark ? '#262626' : '#fafafa',
                                        border: `1px solid ${isDark ? '#333' : '#eee'}`
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoneyIcon fontSize="small" color="success" />
                                        <Typography variant="body2" fontWeight={600}>
                                            NIO
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        C${Number(diaData.totalNIO || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        })}
                                    </Typography>
                                </Box>

                                {/* Total USD */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        backgroundColor: isDark ? '#262626' : '#fafafa',
                                        border: `1px solid ${isDark ? '#333' : '#eee'}`
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoneyIcon fontSize="small" color="secondary" />
                                        <Typography variant="body2" fontWeight={600}>
                                            USD
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        ${Number(diaData.totalUSD || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 2
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No hay datos disponibles para este día
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Popover>
        </Box>
    );
};

export default PagosResumen;