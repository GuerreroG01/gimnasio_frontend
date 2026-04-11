import React from 'react';
import {
  Box,
  TextField,
  useTheme,
  InputAdornment
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const FiltroPagos = ({ nombreCliente, setNombreCliente }) => {
  const theme = useTheme();

  const handleChange = (e) => {
    setNombreCliente(e.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: {xs: '95%', sm: 400},
        width: '100%',
      }}
    >
      <TextField
        size="small"
        placeholder="Buscar cliente..."
        value={nombreCliente}
        onChange={handleChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FiltroPagos;