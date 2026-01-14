import React from 'react';
import { Card, CardContent, Typography, Grid, Divider, Box } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const PagosResumen = ({ diaseleccionado, pagosDayData }) => {

    const diaData = pagosDayData.find((data) => data.dia === diaseleccionado);

    return (
        <Grid container spacing={2} sx={{ marginTop: 2, justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ width: '90%', boxShadow: 3, borderRadius: 3, padding: 2, maxHeight: 150, border: '1px solid #e0e0e0' }}>
                    <CardContent>
                        {/* Encabezado */}
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', textAlign: 'center' }}>
                            Día: {diaseleccionado}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        {diaData ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <PaymentIcon color="primary" fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Pagos realizados:
                                    </Typography>
                                    <Typography variant="body2">{diaData.pagosRealizados}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <AttachMoneyIcon color="success" fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Total NIO:
                                    </Typography>
                                    <Typography variant="body2">
                                        C${diaData.totalNIO.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <AttachMoneyIcon color="secondary" fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Total USD:
                                    </Typography>
                                    <Typography variant="body2">
                                        ${diaData.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Typography variant="body2" sx={{ marginTop: 1, textAlign: 'center', color: '#757575' }}>
                                No hay datos disponibles para este día.
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default PagosResumen;
