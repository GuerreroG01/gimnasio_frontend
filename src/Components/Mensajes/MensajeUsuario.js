import React, { useEffect, useState } from 'react';
import mensajeService from '../../Services/MensajeService';
import { Button, IconButton, Tooltip, Alert, Typography, Card, CardContent, Container, Box, Skeleton, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import CardMensaje from './CardMensaje';
import { AuthContext } from "../../Context/AuthContext";
import EmptyState from "../../Shared/Components/EmptyState";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const MensajeUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState('');
  const [showAlerts] = useState(false);
  const [mensajeEditado, setMensajeEditado] = useState(null);
  const [nuevoMensaje, setNuevoMensaje] = useState(false);
  const ahora = new Date();
  const fechaLocal = ahora
    .toLocaleDateString('es-ES', {
      timeZone: 'America/Managua',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');
  const { usuario } = React.useContext(AuthContext);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await mensajeService.getMensajesOtros();
      const sortedMessages = response.sort((a, b) => b.codigo - a.codigo);
      setMensajes(sortedMessages);
    } catch (error) {
      setError('Hubo un problema al cargar los mensajes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMessage = async (texto) => {
    try {
      const newMessage = { Texto: texto, Emisor: usuario, FechaEmision: fechaLocal, Leido: false };
      await mensajeService.createMensaje(newMessage);

      fetchMessages();
      setMensajes((prevMensajes) => {
        const updatedMessages = [newMessage, ...prevMensajes];
        return updatedMessages;
      });

      setNuevoMensaje(false);
    } catch (error) {
      setError('Hubo un problema al enviar el mensaje.');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (id) {
      try {
        await mensajeService.deleteMensaje(id);
        fetchMessages();
      } catch (error) {
        setError('Hubo un problema al eliminar el mensaje.');
      }
    } else {
      console.error('El mensaje no tiene un id válido.', id);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleEditMessage = (mensaje) => {
    setMensajeEditado(mensaje);
    setNuevoMensaje(false);
  };

  const handleUpdateMessage = async (id, texto) => {
    try {
      const updatedMessage = { Codigo: id, Texto: texto, Emisor: usuario, FechaEmision: fechaLocal, Leido: false };
      if (!updatedMessage.Codigo || !updatedMessage.Texto) {
        throw new Error('Faltan datos en el mensaje.');
      }
      await mensajeService.updateMensaje(id, updatedMessage);
      setMensajeEditado(null);
      fetchMessages();
    } catch (error) {
      console.error('Error en la actualización:', error);
      setError('Hubo un problema al actualizar el mensaje.');
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  const handleCloseNuevoMensaje = () => {
    setNuevoMensaje(false);
    setMensajeEditado(null);
  };

  return (
    <Container maxWidth="md" sx={{ position: 'relative' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Mensajes
      </Typography>

      <Tooltip title="Nuevo">
        <IconButton
          color="primary"
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
          onClick={() => {
            setNuevoMensaje(true);
            setMensajeEditado({ Texto: '' });
          }}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          width="100%"
        >
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ marginBottom: 3, boxShadow: 3, width: '100%' }}>
              <CardContent>
                <Skeleton variant="text" width="100%" height={25} sx={{ marginBottom: 1 }} />
                <Skeleton variant="text" width="100%" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {!loading && mensajes.length === 0 && !nuevoMensaje && (
        <EmptyState
          title="Sin mensajes"
          message="Aquí aparecerán tus mensajes cuando recibas alguno."
          Icon={ChatBubbleOutlineIcon}
        />
      )}

      {showAlerts && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
          <Button variant="outlined" color="primary" onClick={fetchMessages} sx={{ marginLeft: 2 }}>
            Reintentar
          </Button>
        </Alert>
      )}

      <Box sx={{ marginTop: 3 }}>
        {nuevoMensaje && (
          <CardMensaje
            onSendMessage={handleSaveMessage}
            mensajeEditado={mensajeEditado}
            onUpdateMessage={handleUpdateMessage}
            onClose={handleCloseNuevoMensaje}
          />
        )}

        {!loading && !error && mensajes.length > 0 && mensajes.map((mensaje) => (
              <React.Fragment key={mensaje.codigo}>
                {mensajeEditado && mensajeEditado.codigo === mensaje.codigo ? (
                  <CardMensaje
                    onSendMessage={handleSaveMessage}
                    mensajeEditado={mensajeEditado}
                    onUpdateMessage={handleUpdateMessage}
                    onClose={handleCloseNuevoMensaje}
                  />
                ) : (
                  <Card
                    key={mensaje.codigo}
                    sx={{
                      marginBottom: 3,
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.03)' },
                      position: 'relative',
                    }}
                    onClick={() => handleEditMessage(mensaje)}
                  >
                    <CardContent sx={{ position: 'relative', paddingRight: '60px' }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          borderRadius: 1,
                          padding: '2px 6px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          fontSize: '0.75rem',
                          color: 'primary.main',
                          fontWeight: 500,
                          userSelect: 'none',
                          zIndex: 1,
                        }}
                      >
                        <EventIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
                        {formatFecha(mensaje.fechaEmision)}
                      </Box>

                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {mensaje.texto}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginTop: 1, fontStyle: 'italic' }}
                      >
                        Enviado por: <strong>{mensaje.emisor}</strong>
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(mensaje.codigo);
                        }}
                        sx={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                        }}
                        >
                        <DeleteIcon />
                    </IconButton>
                    </CardContent>
                  </Card>
                )}
              </React.Fragment>
            ))}
      </Box>
    </Container>
  );
};
export default MensajeUsuario;