import { Container, useTheme, Box, Typography, IconButton, Tooltip, Modal, Button, Alert, Pagination, Stack } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FiltroClientes from './FiltroClientes';
import TableClientes from './TableClientes';
import './Style.css';
import CircularProgress from '@mui/material/CircularProgress';

const Index = ({ alerta, setAlerta, nombreCliente, setNombreCliente, apellidoCliente, setApellidoCliente, showFilters, setShowFilters, letrasDisponibles, letraSeleccionada, setLetraSeleccionada, loadingFilter, setLoadingFilter, handleCreateNew,
    clienteFiltrados, loading, page, rowsPerPage, handleEdit, handleDeleteOpen, handleDeleteConfirm, handleViewDetails, mostrarPaginacion, handleChangePage, modalOpen, setModalOpen, showLetras
}) => {
  const theme = useTheme();
  return (
    <Container maxWidth="xl" sx={{backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      {alerta.mensaje && (
        <Alert severity={alerta.tipo} onClose={() => setAlerta({ mensaje: '', tipo: '' })} sx={{ marginBottom: 2 }}>
          {alerta.mensaje}
        </Alert>
      )}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        {/* Contenedor del título + filtros */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Clientes
          </Typography>

          <FiltroClientes
            nombreCliente={nombreCliente}
            setNombreCliente={setNombreCliente}
            apellidoCliente={apellidoCliente}
            setApellidoCliente={setApellidoCliente}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setLoadingFilter={setLoadingFilter}
          />
        </Box>
        {showLetras && (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          mb={2}
          sx={{ gap: 2 }}
        >
          {letrasDisponibles.map((letra) => (
            <Box
              key={letra.primeraLetra}
              sx={{
                position: 'relative',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: letraSeleccionada === letra.primeraLetra ? 'scale(1.2)' : 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
              onClick={() => setLetraSeleccionada(letra.primeraLetra)}
            >
              <Typography
                className={letraSeleccionada === letra.primeraLetra ? 'letra blinking' : ''} 
                variant="caption"
                sx={{
                  position: 'absolute',
                  opacity: letraSeleccionada === letra.primeraLetra ? 1 : 1,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'opacity 0.3s ease',
                }}
              >
                {letra.primeraLetra}
              </Typography>
            </Box>                                  
          ))}
        </Box>
      )}
        {/* Botón nuevo cliente */}
        <Tooltip title="Nuevo Usuario">
          <IconButton color="primary" onClick={handleCreateNew}>
            <PersonAddAltOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {loadingFilter ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {clienteFiltrados.length === 0 ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography variant="h6" color="textSecondary">
                No se han encontrado usuarios registrados.
              </Typography>
            </Box>
          ) : (
            <TableClientes
              usuarios={clienteFiltrados}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              onEdit={handleEdit}
              onDelete={handleDeleteOpen}
              onViewDetails={handleViewDetails}
            />
          )}
        </>
      )}

      {mostrarPaginacion && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(clienteFiltrados.length / rowsPerPage)}
              page={page + 1}
              onChange={handleChangePage}
              shape="rounded"
              siblingCount={1}
              boundaryCount={1}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  border: `2px solid ${theme.palette.primary.main}`,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: theme.palette.action.hover,
                  },
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  border: `2px solid ${theme.palette.primary.main}`,
                  transform: 'scale(1.1)',
                },
              }}
            />
          </Stack>
        </Box>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 3, width: '300px', margin: 'auto', marginTop: '20%' }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
            ¿Estás seguro de eliminar este usuario?
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Button onClick={() => setModalOpen(false)} color="secondary">Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="primary">Eliminar</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};
export default Index;