import React, { useState, useEffect } from 'react';
import { Box, Chip, Avatar, TextField, FormControlLabel, Grid, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const FiltroClientes = ({ nombreCliente, setNombreCliente, apellidoCliente, setApellidoCliente, showFilters, setShowFilters, setLoadingFilter  }) => {
  const [tempNombreCliente, setTempNombreCliente] = useState(nombreCliente);
  const [tempApellidoCliente, setTempApellidoCliente] = useState(apellidoCliente);
  const [filteredName, setFilteredName] = useState('');
  const [filteredLastName, setFilteredLastName] = useState('');

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

  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setShowFilters(isChecked);
    
    if (!isChecked) {
      setNombreCliente('');
      setApellidoCliente('');
      setFilteredName('');
      setFilteredLastName('');
    }
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

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  return (
    <Box mb={2} display="flex" flexDirection="column" sx={{
      p: 2,
      bgcolor: "#ffffff",
      borderRadius: 3,
      boxShadow: 6,
      transition: 'all 0.3s ease-in-out',
      '&:hover': { boxShadow: 10 },
    }}>
      <Grid container spacing={1} alignItems="center" sx={{ flexDirection: 'row', mb: 2 }}>
        <Grid item xs={12} sm={3} display="flex" alignItems="center" justifyContent="center">
          <FormControlLabel
            control={<Android12Switch checked={showFilters} onChange={handleSwitchChange} />}
            label={showFilters ? "Filtros Activados" : "Filtros Desactivados"}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                fontWeight: 500,
                color: 'primary.main',
              },
            }}
          />
        </Grid>

        {showFilters && (
          <>
            <Grid item xs={12} sm={5} md={4}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                p: 1,
                boxShadow: 2,
                '&:hover': { boxShadow: 5 },
              }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                <TextField
                  label="Nombre del Cliente"
                  name="nombreCliente"
                  variant="outlined"
                  value={tempNombreCliente}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: 1,
                  }}
                />
                <IconButton onClick={handleBuscar}>
                  <SearchIcon />
                </IconButton>
              </Box>
              {filteredName && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    avatar={<Avatar>{filteredName.charAt(0).toUpperCase()}</Avatar>}
                    label={filteredName}
                    onDelete={() => handleClearFilter('nombre')}
                    deleteIcon={<CloseIcon />}
                    color="success"
                    sx={{
                      fontSize: '0.875rem',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sm={5} md={4}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                p: 1,
                boxShadow: 2,
                '&:hover': { boxShadow: 5 },
              }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
                <TextField
                  label="Apellido del Cliente"
                  name="apellidoCliente"
                  variant="outlined"
                  value={tempApellidoCliente}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: 1,
                  }}
                />
                <IconButton onClick={handleBuscar}>
                  <SearchIcon />
                </IconButton>
              </Box>
              {filteredLastName && (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    avatar={<Avatar>{filteredLastName.charAt(0).toUpperCase()}</Avatar>}
                    label={filteredLastName}
                    onDelete={() => handleClearFilter('apellido')}
                    deleteIcon={<CloseIcon />}
                    color="success"
                    sx={{
                      fontSize: '0.875rem',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};
export default FiltroClientes;