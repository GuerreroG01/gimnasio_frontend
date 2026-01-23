import React from 'react';
import { Card, CardContent, TextField, Box, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close'; 

const CardMensaje = ({ onSendMessage, mensajeEditado, onUpdateMessage, onClose  }) => {
    const [texto, setTexto] = React.useState(mensajeEditado ? mensajeEditado.texto : '');
    const handleTextoChange = (e) => {
        setTexto(e.target.value);
    };

    const handleSendMessage = () => {
        if (texto.trim() === '') {
            alert('Por favor ingresa un mensaje.');
            return;
        }
        if (mensajeEditado && mensajeEditado.codigo) {
            onUpdateMessage(mensajeEditado.codigo, texto);
        } else { 
            onSendMessage(texto);
        }
        setTexto('');
    };

    return (
        <Card sx={{ marginTop: 3, marginBottom: 3, boxShadow: 2, height: '130px' }}>
            <CardContent sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                    {mensajeEditado && mensajeEditado.codigo ? 'Editar Mensaje' : 'Nuevo Mensaje'}
                </Typography>

                {onClose && (
                    <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                    </IconButton>
                )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Mensaje"
                    value={texto}
                    onChange={handleTextoChange}
                    fullWidth
                    multiline
                    rows={1}
                    sx={{ marginRight: 1, flexGrow: 1 }}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                    <SendIcon />
                </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};
export default CardMensaje;