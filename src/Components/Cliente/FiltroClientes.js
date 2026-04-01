import React, { useEffect } from 'react';
import {
  Box,
  useTheme,
  Chip,
  Avatar,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Stack,
  Button,
  Paper
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTempNombreCliente(nombreCliente);
    setTempApellidoCliente(apellidoCliente);
  }, [nombreCliente, apellidoCliente]);

  const handleBuscar = () => {
    setNombreCliente(tempNombreCliente || '');
    setApellidoCliente(tempApellidoCliente || '');
    setFilteredName(tempNombreCliente || '');
    setFilteredLastName(tempApellidoCliente || '');
    if (isMobile) setShowFilters(false);
  };

  const handleClearAll = () => {
    setNombreCliente('');
    setApellidoCliente('');
    setFilteredName('');
    setFilteredLastName('');
    setTempNombreCliente('');
    setTempApellidoCliente('');
  };

  const handleSwitchChange = () => setShowFilters(prev => !prev);

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

  // 🔹 Desktop filters (sin cambios)
  const FiltersBox = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        position: { xs: 'relative', md: 'absolute' },
        right: { md: 40 },
        width: { xs: '100%', md: 'auto' },
        gap: 2,
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.paper,
        p: 1,
        borderRadius: 1,
        boxShadow: 3,
        zIndex: 1300,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            label="Nombre"
            value={tempNombreCliente}
            onChange={(e) => setTempNombreCliente(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <IconButton onClick={handleBuscar}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>
        {filteredName && (
          <Chip
            avatar={<Avatar>{filteredName.charAt(0).toUpperCase()}</Avatar>}
            label={filteredName}
            onDelete={() => handleClearFilter('nombre')}
            sx={{ mt: 0.5 }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
          <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
          <TextField
            label="Apellido"
            value={tempApellidoCliente}
            onChange={(e) => setTempApellidoCliente(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <IconButton onClick={handleBuscar}>
            <SearchIcon fontSize="small" />
          </IconButton>
        </Box>
        {filteredLastName && (
          <Chip
            avatar={<Avatar>{filteredLastName.charAt(0).toUpperCase()}</Avatar>}
            label={filteredLastName}
            onDelete={() => handleClearFilter('apellido')}
            sx={{ mt: 0.5 }}
          />
        )}
      </Box>
    </Box>
  );

  // 🔹 Mobile filters optimizado
  const MobileFilters = (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {/* Inputs */}
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          fullWidth
          value={tempNombreCliente}
          onChange={(e) => setTempNombreCliente(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ borderRadius: 2 }}
        />
        <TextField
          label="Apellido"
          fullWidth
          value={tempApellidoCliente}
          onChange={(e) => setTempApellidoCliente(e.target.value)}
          variant="outlined"
          size="medium"
          sx={{ borderRadius: 2 }}
        />
      </Stack>

      {/* Chips de filtros activos */}
      {(filteredName || filteredLastName) && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          {filteredName && (
            <Chip
              label={filteredName}
              onDelete={() => handleClearFilter('nombre')}
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          )}
          {filteredLastName && (
            <Chip
              label={filteredLastName}
              onDelete={() => handleClearFilter('apellido')}
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Paper>
      )}

      {/* Botones de acción */}
      <Stack spacing={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => { handleBuscar(); handleSwitchChange(); }}
          startIcon={<SearchIcon />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearAll}
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
          }}
        >
          Limpiar
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Box display="flex" alignItems="center" position="relative">
      <Tooltip title={showFilters ? 'Cerrar filtros' : 'Abrir filtros'}>
        <IconButton
          onClick={handleSwitchChange}
          sx={{ color: showFilters ? 'error.main' : 'grey.500', transition: 'color 0.3s ease', height: 40, width: 40, p: 0 }}
        >
          {showFilters ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Tooltip>

      {isMobile ? (
        <Dialog open={showFilters} onClose={handleSwitchChange} fullScreen>
          <DialogTitle
            sx={{
              bgcolor: theme.palette.background.default,
              m: 0,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            Filtros
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleSwitchChange}
              aria-label="close"
              sx={{ p: 0 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              mt: 0,
              bgcolor: theme.palette.background.default,
              '& :first-of-type': {
                borderTop: 'none',
              },
            }}
          >
            <Box sx={{ pt: 2 }}> 
              {MobileFilters}
            </Box>
          </DialogContent>
        </Dialog>
      ) : (
        <Fade in={showFilters} timeout={300} mountOnEnter unmountOnExit>
          {FiltersBox}
        </Fade>
      )}
    </Box>
  );
};

export default FiltroClientes;