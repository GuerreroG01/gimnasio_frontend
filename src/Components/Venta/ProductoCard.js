import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useExistencias } from '../../Context/ExistenciaContext';

const ProductoCard = ({ producto, onSelect, isSelected, esProductoEditando }) => {
    const handleClick = () => {
        onSelect(producto);
    };
    const modelo = 'productos';
    const { existencias } = useExistencias();
    const monedaSimbolo = producto.moneda === 'USD' ? '$' : 'C$';
    
    const [existenciaActual, setExistenciaActual] = useState(
        existencias?.[modelo]?.[producto.codigoProducto] ?? producto.existencias
    );

    useEffect(() => {
        setExistenciaActual(existencias?.[modelo]?.[producto.codigoProducto] ?? producto.existencias);
    }, [existencias, producto.codigoProducto, modelo, producto.existencias]);

    return (
        <Card
            variant="outlined"
            sx={{
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: isSelected || esProductoEditando ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected || esProductoEditando ? '0px 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
                cursor: 'pointer',
                backgroundColor: esProductoEditando ? '#ffecb3' : 'white',
                '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
                },
                marginTop: 2,
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Typography variant="h6">{producto.descripcion}</Typography>
                <Typography variant="body1" color="text.secondary">
                    Precio: {monedaSimbolo}{producto.precio} | Existencias: {existenciaActual}
                </Typography>
                {esProductoEditando && (
                    <Typography variant="caption" color="primary">
                        (Editando)
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};
export default ProductoCard;