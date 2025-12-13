import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const PagosResumen = ({ 
    diaseleccionado, 
    pagosDayData 
}) => {

    const diaData = pagosDayData.find((data) => 
        data.dia === diaseleccionado
    );

    return (
        <Grid container spacing={2} sx={{ marginTop: 2, justifyContent: 'center' }}>
            <Grid>
                <Card sx={{ width: '100%', boxShadow: 4, borderRadius: 3, padding: 2, border: '1px solid #ddd' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            Día: {diaseleccionado}
                        </Typography>
                        {diaData ? (
                            <div>
                                <Typography variant="body2" sx={{ marginTop: 1 }}>
                                    <strong>Pagos:</strong> {diaData.pagosRealizados}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Total:</strong> C${diaData.totalGanancias.toLocaleString()}
                                </Typography>
                            </div>
                        ) : (
                            <Typography variant="body2" sx={{ marginTop: 1 }}>
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