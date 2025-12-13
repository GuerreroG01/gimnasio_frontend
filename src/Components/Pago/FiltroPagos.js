import React, { useEffect, useState } from 'react';
import { Box, TextField, FormControlLabel, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import AccountCircle from '@mui/icons-material/AccountCircle';

const FiltroPagos = ({ nombreCliente, setNombreCliente }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [tempNombreCliente, setTempNombreCliente] = useState(nombreCliente);

  useEffect(() => {
    setTempNombreCliente(nombreCliente);
  }, [showFilters, nombreCliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombreCliente') {
      setTempNombreCliente(value);
      setNombreCliente(value);
    }
  };

  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setShowFilters(isChecked);
    if (!isChecked) {
      setNombreCliente('');
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
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
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
    <Box
      mb={2}
      display="flex"
      flexDirection="column"
      sx={{
        p: 2,
        bgcolor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: 400,
        width: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <FormControlLabel
            control={<Android12Switch checked={showFilters} onChange={handleSwitchChange} />}
            label={showFilters ? 'Filtros Activados' : 'Filtros Desactivados'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .MuiFormControlLabel-label': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        </Grid>

        {showFilters && (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 1,
                boxShadow: 1,
                p: 1,
              }}
            >
              <AccountCircle sx={{ color: 'action.active', mr: 1 }} />
              <TextField
                label="Nombre del Cliente"
                name="nombreCliente"
                variant="outlined"
                value={tempNombreCliente}
                onChange={handleChange}
                fullWidth
                sx={{
                  backgroundColor: '#f4f4f4',
                  borderRadius: 1,
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
export default FiltroPagos;