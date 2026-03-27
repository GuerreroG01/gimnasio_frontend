import React, { useEffect } from 'react';
import { Box, useTheme, Chip, Avatar, TextField, Tooltip, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const FiltroClientes = ({
  nombreCliente,
  setNombreCliente,
  apellidoCliente,
  setApellidoCliente,
  showFilters,
  setShowFilters
}) => {
  const [tempNombreCliente, setTempNombreCliente] = React.useState(nombreCliente);
  const [tempApellidoCliente, setTempApellidoCliente] = React.useState(apellidoCliente);
  const [filteredName, setFilteredName] = React.useState('');
  const [filteredLastName, setFilteredLastName] = React.useState('');
  const theme = useTheme();

  useEffect(() => {
    setTempNombreCliente(nombreCliente);
    setTempApellidoCliente(apellidoCliente);
  }, [nombreCliente, apellidoCliente]);

  const handleBuscar = () => {
    setNombreCliente(tempNombreCliente || '');
    setApellidoCliente(tempApellidoCliente || '');
    setFilteredName(tempNombreCliente || '');
    setFilteredLastName(tempApellidoCliente || '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombreCliente") setTempNombreCliente(value);
    else if (name === "apellidoCliente") setTempApellidoCliente(value);
  };

  const handleSwitchChange = () => {
    setShowFilters((prev) => {
      const newValue = !prev;
      if (!newValue) {
        setNombreCliente('');
        setApellidoCliente('');
        setFilteredName('');
        setFilteredLastName('');
        setTempNombreCliente('');
        setTempApellidoCliente('');
      }
      return newValue;
    });
  };

  const handleClearFilter = (campo) => {
    if (campo === 'nombre') {
      setFilteredName('');
      setNombreCliente('');
      setTempNombreCliente('');
    } else if (campo === 'apellido') {
      setFilteredLastName('');
      setApellidoCliente('');
      setTempApellidoCliente('');
    }
  };

  return (
    <Box display="flex" alignItems="center" position="relative">
      <Tooltip title={showFilters ? 'Cerrar filtros' : 'Abrir filtros'}>
        <IconButton
          onClick={handleSwitchChange}
          sx={{
            color: showFilters ? 'error.main' : 'grey.500',
            transition: 'color 0.3s ease',
            height: 40,
            width: 40,
            p: 0,
          }}
        >
          {showFilters ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Tooltip>

      <Slide
        in={showFilters}
        direction="left"
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            position: { xs: 'relative', md: 'absolute' },
            right: { xs: 'auto', md: 40 },
            width: { xs: '100%', md: 'auto' },
            gap: 2,
            alignItems: 'flex-start',
            backgroundColor: theme.palette.background.paper,
            p: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 1300,
            transformOrigin: 'right center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
              <TextField
                label="Nombre"
                name="nombreCliente"
                value={tempNombreCliente}
                onChange={handleChange}
                size="small"
                sx={{ width: 150 }}
              />
              <IconButton onClick={handleBuscar} sx={{ p: 0, ml: 0.5 }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
            {filteredName && (
              <Chip
                avatar={<Avatar>{filteredName.charAt(0).toUpperCase()}</Avatar>}
                label={filteredName}
                onDelete={() => handleClearFilter('nombre')}
                deleteIcon={<CloseIcon sx={{ color: theme.palette.error.main }} />}
                sx={{ fontSize: '0.875rem', borderRadius: 2, color: theme.palette.text.primary }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
              <TextField
                label="Apellido"
                name="apellidoCliente"
                value={tempApellidoCliente}
                onChange={handleChange}
                size="small"
                sx={{ width: 150 }}
              />
              <IconButton onClick={handleBuscar} sx={{ p: 0, ml: 0.5 }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
            {filteredLastName && (
              <Chip
                avatar={<Avatar>{filteredLastName.charAt(0).toUpperCase()}</Avatar>}
                label={filteredLastName}
                onDelete={() => handleClearFilter('apellido')}
                deleteIcon={<CloseIcon sx={{ color: theme.palette.error.main }} />}
                sx={{ fontSize: '0.875rem', borderRadius: 2, color: theme.palette.text.primary }}
              />
            )}
          </Box>
        </Box>
      </Slide>
    </Box>
  );
};

export default FiltroClientes;