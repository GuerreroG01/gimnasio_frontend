import { Container, useTheme, Box, Typography, IconButton, Tooltip, Modal, Button, Pagination, Stack } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import FiltroClientes from './FiltroClientes';
import TableClientes from './TableClientes';
import './Style.css';
import CircularProgress from '@mui/material/CircularProgress';
import CustomSnackbar from '../../Shared/Components/CustomSnackbar';

const Index = ({ alerta, setAlerta, nombreCliente, setNombreCliente, apellidoCliente, setApellidoCliente,
  showFilters, setShowFilters, handleCreateNew, clienteFiltrados, loading, page, handleEdit,
  handleDeleteOpen, handleDeleteConfirm, handleViewDetails, handleChangePage, modalOpen, 
  setModalOpen, totalPaginas, ordenarPor, orden, handleSort, resetFiltrado }) => {
  const theme = useTheme();
  return (
    <Container maxWidth={false} sx={{ backgroundColor: theme.palette.background.paper, minHeight: '100vh' }}>
      <CustomSnackbar
        open={!!alerta.mensaje}
        message={alerta.mensaje}
        severity={alerta.tipo || 'info'}
        onClose={() => setAlerta({ mensaje: '', tipo: '' })}
        autoHideDuration={3000}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
        >
          Clientes
        </Typography>
        <Box display="flex" alignItems="center">
          <FiltroClientes
            nombreCliente={nombreCliente}
            setNombreCliente={setNombreCliente}
            apellidoCliente={apellidoCliente}
            setApellidoCliente={setApellidoCliente}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
          <Tooltip title="Nuevo Usuario">
            <IconButton color="primary" onClick={handleCreateNew}>
              <PersonAddAltOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : clienteFiltrados.length === 0 ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <Typography variant="h6" color="textSecondary">
            No se han encontrado usuarios registrados.
          </Typography>
        </Box>
      ) : (
        <TableClientes
          usuarios={clienteFiltrados}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteOpen}
          onViewDetails={handleViewDetails}
          onSort={handleSort}
          ordenarPor={ordenarPor}
          orden={orden}
          resetFiltrado ={resetFiltrado}
        />
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        <Stack spacing={2}>
          <Pagination
            count={totalPaginas || null}
            page={page}
            onChange={handleChangePage}
            shape="rounded"
            color="primary"
          />
        </Stack>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            p: 3,
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRadius: 2,
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 0 20px rgba(0,0,0,0.8)'
                : theme.shadows[5],
            width: 320,
            mx: 'auto',
            mt: '20%',
            border: (theme) =>
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
          }}
        >
          <Typography variant="h6" gutterBottom>
            ¿Estás seguro de eliminar este usuario?
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button
              onClick={() => setModalOpen(false)}
              color="inherit"
              variant="outlined"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>

    </Container>
  );
};

export default Index;