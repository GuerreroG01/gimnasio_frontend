import React, { useState } from 'react';
import { Box, Divider, Card, CardContent, Typography, Grid, IconButton, Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { keyframes } from '@mui/system';
import {/* Edit as EditIcon,*/ Delete as DeleteIcon } from '@mui/icons-material';
//import { useNavigate } from 'react-router-dom';
import DetailsPago from './DetailsPago';
import pagoService from '../../Services/PagoService';
import TiempoPagoService from '../../Services/TiempoPagoService';

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PagosCards = ({ pagos, onPagoDeleted }) => {
  const [openModal, setOpenModal] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [infopago, setinfopago] = useState(null);
  //const navigate = useNavigate();


  const handleOpenModal = (pago) => {
    console.log("Datos del pago seleccionado:", pago);

    const fetchInfoPago = async () => {
      if (pago && pago.codigoPago) {
        try {
          const response = await TiempoPagoService.getByCodigoPago(pago.codigoPago);

          if (response && response.data) {
            setinfopago(response.data);
          } else {
            setinfopago('No hay antecedente de vencimiento para este pago');
          }
        } catch (error) {
          console.error('Error al obtener la información del pago:', error);
          setinfopago('Error al obtener la información');
        }
      }
    };

    setPagoSeleccionado(pago);
    fetchInfoPago();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /*const handleEditClick = (id) => {
    navigate(`/pagos/${id}/update`);
  };*/
  
  const handleDeleteClick = (pago, event) => {
    event.stopPropagation();
    setPagoAEliminar(pago);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (pagoAEliminar) {
      console.log(`Eliminando el pago con código: ${pagoAEliminar.codigoPago}`);
  
      try {
        const fechaClienteExiste = await pagoService.checkFechaClienteExist(pagoAEliminar.codigoPago);
  
        if (fechaClienteExiste) {
          await pagoService.deleteFecha({
            CodigoPago: pagoAEliminar.codigoPago,
          });
        } else {
          console.log('No se encontró el registro del tiempo pagado.');
        }
        await pagoService.deletePago(pagoAEliminar.codigoPago);
        console.log('Pago eliminado exitosamente con código:', pagoAEliminar.codigoPago);
        onPagoDeleted(pagoAEliminar.codigoPago);
  
      } catch (error) {
        console.error("Error al eliminar el pago:", error);
      }
    }
    setPagoAEliminar(null);
    setOpenDeleteModal(false);
  };    

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
  };
  if (!pagos || pagos.length === 0) return null;

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {pagos.map((pago) => (
            <Grid item xs={12} sm={6} md={4} key={pago.codigoPago}>
              <Card
                sx={{
                  maxWidth: 345,
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                  },
                  animation: `${fadeInUp} 0.5s ease-out`,
                }}
                onClick={() => handleOpenModal(pago)}
              >
                <CardContent sx={{ position: 'relative', padding: 3, backgroundColor: '#fefefe' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 1 }}>
                    No. Pago: {pago.codigoPago}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {pago.cliente ? pago.cliente.nombreCompleto : 'Cliente no disponible'}
                  </Typography>
                  <Divider sx={{ marginY: 1 }} />
                  <Typography variant="body1" sx={{ marginBottom: 0.5 }}>
                    <strong>Monto:</strong> ${Number(pago.monto).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fecha de Pago:</strong> {new Date(pago.fechaPago).toLocaleDateString()}
                  </Typography>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'flex',
                      gap: 1,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover, .MuiCard-root:hover &': {
                        opacity: 1,
                      },
                    }}
                  >
                    {/*<IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 40,
                      }}
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(pago.codigoPago);
                      }}
                    >
                      <EditIcon />
                    </IconButton>*/}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                      color="error"
                      onClick={(e) => handleDeleteClick(pago, e)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {openModal && (
        <DetailsPago
          open={openModal}
          onClose={handleCloseModal}
          pago={pagoSeleccionado}
          infopago={infopago}
        />
      )}
      <Dialog
        open={openDeleteModal}
        onClose={handleDeleteCancel}
      >
        <DialogContent>
          <Typography variant="body1">
            ¿Está seguro que desea borrar el pago de <strong>{pagoAEliminar?.cliente?.nombreCompleto}</strong> del <strong>{new Date(pagoAEliminar?.fechaPago).toLocaleDateString()}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PagosCards;