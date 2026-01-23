import React, { useState } from 'react';
import {
  Typography, Grid, Dialog, DialogActions, DialogContent,
  DialogTitle, Button, Container, Box,
  Alert, AlertTitle, SpeedDial, SpeedDialIcon, SpeedDialAction,
  FormControl, InputLabel, Select, MenuItem, Pagination, useTheme
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddIcon from '@mui/icons-material/Add';

import ProductoForm from './ProductoForm';
import ProductoCard from './ProductoCard';

import vacioImg from '../../assets/Images/vacio.png';
import { useNavigate } from 'react-router-dom';

const IndexProducto = ({ productos, categorias, categoriaSeleccionada, handleCategoriaChange, handleOpenNew, handleOpenEdit, handleClose,
  loading, success, error, currentProducto, handleChange, handleSubmit, anchorEl, openDeleteDialog, setOpenDeleteDialog, confirmDelete,
  deleteSuccess, deleteError, handleDelete, getCategoryIcon }) => {

  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const theme = useTheme();

  const actions = [
    { icon: <AddIcon />, name: 'Nuevo Producto', onClick: (e) => handleOpenNew(e) },
    { icon: <ShoppingBagIcon />, name: 'Ventas', onClick: () => navigate('/venta') },
    { icon: <ShoppingCartIcon />, name: 'Vender Producto', onClick: () => navigate('/venta/new') },
  ];

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleProductos = productos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <FormControl
          sx={{
            minWidth: 220,
            mt: -3,
            "& .MuiInputLabel-root": {
              color: "text.primary",
              fontWeight: 500,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              backgroundColor: theme.palette.background.paper,
              height: 48,
              "& fieldset": {
                borderColor: theme.palette.divider,
              },
              "&:hover fieldset": {
                borderColor: "#3f51b5",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3f51b5",
                borderWidth: 2,
              },
            },
            "& .MuiSelect-select": {
              padding: "10px 14px",
              fontWeight: 500,
            },
          }}
        >
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoriaSeleccionada}
            label="Categoría"
            onChange={handleCategoriaChange}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SpeedDial
            ariaLabel="SpeedDial de productos"
            icon={<SpeedDialIcon />}
            direction="down"
            sx={{
              position: 'fixed',
              bottom: { xl: 330, lg: 250, md: 200, sm: 185, xs: 185 },
              right: 32,
              zIndex: 1500,
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
        </Box>
      </Box>

      {productos.length === 0 ? (
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <img
            src={vacioImg}
            alt="No hay productos"
            style={{ width: '200px', marginBottom: '20px' }}
          />
          <Typography variant="h6" color="textSecondary">
            No hay productos disponibles.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            ¡Sé el primero en agregar productos a tu inventario!
          </Typography>
        </Box>
      ) : (
        <>
          <Grid
            container
            rowSpacing={4}
            columnSpacing={2}
            justifyContent="center"
          >
            {visibleProductos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} key={producto.codigoProducto}>
                <ProductoCard
                  producto={producto}
                  onClick={(e) => handleOpenEdit(e, producto)}
                  getCategoryIcon={getCategoryIcon}
                />
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      <ProductoForm
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        currentProducto={currentProducto}
        handleChange={handleChange}
        onClose={handleClose}
        onSubmit={handleSubmit}
        loading={loading}
        success={success}
        error={error}
        handleDelete={handleDelete}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este producto?
          </Typography>

          {deleteSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <AlertTitle>Éxito</AlertTitle>
              {deleteSuccess}
            </Alert>
          )}

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <AlertTitle>Error</AlertTitle>
              {deleteError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default IndexProducto;