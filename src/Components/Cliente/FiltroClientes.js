import React, { useEffect } from 'react';
import { Box, Chip, Avatar, TextField, Tooltip, Grid, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const FiltroClientes = ({ nombreCliente, setNombreCliente, apellidoCliente, setApellidoCliente, showFilters, setShowFilters, setLoadingFilter  }) => {
  const [tempNombreCliente, setTempNombreCliente] = React.useState(nombreCliente);
  const [tempApellidoCliente, setTempApellidoCliente] = React.useState(apellidoCliente);
  const [filteredName, setFilteredName] = React.useState('');
  const [filteredLastName, setFilteredLastName] = React.useState('');
  useEffect(() => {
    setTempNombreCliente(nombreCliente);
    setTempApellidoCliente(apellidoCliente);
  }, [nombreCliente, apellidoCliente]);

  const handleBuscar = () => {
    setLoadingFilter(true);
    if (tempNombreCliente && tempApellidoCliente) {
      setFilteredName(tempNombreCliente);
      setFilteredLastName(tempApellidoCliente);
      setNombreCliente(tempNombreCliente);
      setApellidoCliente(tempApellidoCliente);
    } else if (tempNombreCliente) {
      setFilteredName(tempNombreCliente);
      setFilteredLastName('');
      setNombreCliente(tempNombreCliente);
      setApellidoCliente('');
    } else if (tempApellidoCliente) {
      setFilteredLastName(tempApellidoCliente);
      setFilteredName('');
      setApellidoCliente(tempApellidoCliente);
      setNombreCliente('');
    }
    setLoadingFilter(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombreCliente") {
      setTempNombreCliente(value);
    } else if (name === "apellidoCliente") {
      setTempApellidoCliente(value);
    }
  };

  const handleSwitchChange = () => {
    setShowFilters((prev) => {
      const newValue = !prev;

      if (!newValue) {
        setNombreCliente('');
        setApellidoCliente('');
        setFilteredName('');
        setFilteredLastName('');
      }

      return newValue;
    });
  };

  const handleClearFilter = (campo) => {
    if (campo === 'nombre') {
      setFilteredName('');
      setNombreCliente('');
    } else if (campo === 'apellido') {
      setFilteredLastName('');
      setApellidoCliente('');
    }
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1}
      sx={{
        transform: showFilters ? 'translateX(0)' : '-600px',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
      <Grid container spacing={1} alignItems="flex-start" sx={{ mb: 2 }}>
        <Grid item xs={12} sm="auto" display="flex" alignItems="center" justifyContent="flex-start" >
          <Tooltip title={showFilters ? 'Filtros activados' : 'Filtros desactivados'}>
            <IconButton
              onClick={handleSwitchChange}
              sx={{
                color: showFilters ? 'success.main' : 'grey.500',
                transition: 'color 0.3s ease',
              }}
            >
              <SearchIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm>
          <Slide
            in={showFilters}
            direction="right"
            timeout={300}
            easing={{
              enter: 'cubic-bezier(0.4, 0, 0.2, 1)',
              exit: 'cubic-bezier(0.4, 0, 1, 1)',
            }}
            mountOnEnter
            unmountOnExit
          >
            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} sm={6}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 1,
                  p: 0.5,
                  boxShadow: 1,
                  minWidth: 200,
                  '&:hover': { boxShadow: 3 },
                }}>
                  <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                  <TextField
                    label="Nombre del Cliente"
                    name="nombreCliente"
                    variant="outlined"
                    value={tempNombreCliente}
                    onChange={handleChange}
                    fullWidth
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                  <IconButton onClick={handleBuscar}>
                    <SearchIcon />
                  </IconButton>
                </Box>

                {filteredName && (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 0.5 }}>
                    <Chip
                      avatar={<Avatar>{filteredName.charAt(0).toUpperCase()}</Avatar>}
                      label={filteredName}
                      onDelete={() => handleClearFilter('nombre')}
                      deleteIcon={<CloseIcon />}
                      color="success"
                      sx={{ fontSize: '0.875rem', borderRadius: 2 }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 1,
                  p: 0.5,
                  boxShadow: 1,
                  minWidth: 200,
                  '&:hover': { boxShadow: 3 },
                }}>
                  <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                  <TextField
                    label="Apellido del Cliente"
                    name="apellidoCliente"
                    variant="outlined"
                    value={tempApellidoCliente}
                    onChange={handleChange}
                    fullWidth
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                  <IconButton onClick={handleBuscar}>
                    <SearchIcon />
                  </IconButton>
                </Box>

                {filteredLastName && (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 0.5 }}>
                    <Chip
                      avatar={<Avatar>{filteredLastName.charAt(0).toUpperCase()}</Avatar>}
                      label={filteredLastName}
                      onDelete={() => handleClearFilter('apellido')}
                      deleteIcon={<CloseIcon />}
                      color="success"
                      sx={{ fontSize: '0.875rem', borderRadius: 2 }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
};
export default FiltroClientes;