import React from 'react';
import { TextField, Grid, Card, CardContent, CardHeader, Avatar, Box, Typography, CircularProgress, IconButton, InputAdornment, Chip } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import ClienteService from '../../Services/ClienteService';

const SeleccionCliente = ({ onSelectCliente }) => {
  const [searchName, setSearchName] = React.useState('');
  const [searchSurname, setSearchSurname] = React.useState('');
  const [searchCode, setSearchCode] = React.useState('');
  const [cliente, setCliente] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState([]);

  const handleSearch = (type) => {
    setLoading(true);
    let newFilters = [...activeFilters];

    if (type === 'code' && searchCode && !activeFilters.some(filter => filter.type === 'code')) {
      newFilters = [...newFilters, { type: 'code', label: `Código: ${searchCode}` }];
    } else if (type === 'name' && searchName && !activeFilters.some(filter => filter.type === 'name')) {
      newFilters = [...newFilters, { type: 'name', label: `Nombre: ${searchName}` }];
    } else if (type === 'surname' && searchSurname && !activeFilters.some(filter => filter.type === 'surname')) {
      newFilters = [...newFilters, { type: 'surname', label: `Apellido: ${searchSurname}` }];
    }

    setActiveFilters(newFilters);

    if (!searchName && !searchSurname && !searchCode) {
      setCliente([]);
      setLoading(false);
      return;
    }

    if (type === 'code' && searchCode) {
      ClienteService.getClienteById(searchCode)
        .then((response) => {
          setCliente([response.data]);
        })
        .catch((error) => {
          console.error('Error al buscar cliente por código:', error);
          setCliente([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (type === 'name' || type === 'surname') {
      if (searchName && searchSurname) {
        ClienteService.buscarCliente(searchName, searchSurname)
          .then((response) => {
            setCliente(response.data);
          })
          .catch((error) => {
            console.error('Error al buscar cliente por nombre y apellido:', error);
            setCliente([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        if (searchName) {
          ClienteService.buscarCliente(searchName, '')
            .then((response) => {
              setCliente(response.data);
            })
            .catch((error) => {
              console.error('Error al buscar cliente por nombre:', error);
              setCliente([]);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (searchSurname) {
          ClienteService.buscarCliente('', searchSurname)
            .then((response) => {
              setCliente(response.data);
            })
            .catch((error) => {
              console.error('Error al buscar cliente por apellido:', error);
              setCliente([]);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
    }
  };

  const handleRemoveChip = (filterType) => {
    const newFilters = activeFilters.filter(filter => filter.type !== filterType);
    setActiveFilters(newFilters);
  
    if (filterType === 'code') setSearchCode('');
    if (filterType === 'name') setSearchName('');
    if (filterType === 'surname') setSearchSurname('');
  
    if (newFilters.length === 0) {
      setCliente([]);
      setLoading(false);
    } else {
      setLoading(true);
  
      const searchPromises = [];
  
      if (newFilters.some(filter => filter.type === 'code') && searchCode) {
        searchPromises.push(ClienteService.getClienteById(searchCode));
      }
      if (newFilters.some(filter => filter.type === 'name') && searchName) {
        searchPromises.push(ClienteService.buscarCliente(searchName, ''));
      }
      if (newFilters.some(filter => filter.type === 'surname') && searchSurname) {
        searchPromises.push(ClienteService.buscarCliente('', searchSurname));
      }
      Promise.all(searchPromises)
        .then((responses) => {
          const allClientes = responses.flatMap(response => response.data);
          setCliente(allClientes);
        })
        .catch((error) => {
          console.error('Error al buscar cliente:', error);
          setCliente([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };      

  const handleSelectCliente = (cliente) => {
    onSelectCliente(cliente.codigo, `${cliente.nombres} ${cliente.apellidos}`);
  };

  return (
    <Card sx={{ maxWidth: 580, margin: 'auto',  padding: 2 }}>
      <CardHeader subheader="Filtra los cliente por nombre, apellido o código" />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
          {activeFilters.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
              {activeFilters.map((filter) => (
                <Chip
                  key={filter.type}
                  label={filter.label}
                  onDelete={() => handleRemoveChip(filter.type)}
                  deleteIcon={<CloseIcon />}
                  color="primary"
                />
              ))}
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Código"
                variant="outlined"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '80%',
                    md: 140,
                  }
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSearch('code')}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre"
                variant="outlined"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '80%',
                    md: 180,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSearch('name')}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Apellido"
                variant="outlined"
                value={searchSurname}
                onChange={(e) => setSearchSurname(e.target.value)}
                sx={{
                  width: {
                    xs: '100%',
                    sm: '80%',
                    md: 180,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSearch('surname')}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {cliente.length === 0 ? (
              <Typography 
                variant="h6" 
                color="textSecondary" 
                sx={{
                  textAlign: 'center', 
                  width: '100%', 
                  fontWeight: 'bold', 
                  color: 'gray',
                  marginTop: 2
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SearchIcon sx={{ marginRight: 1 }} />
                  Sin Resultados
                </Box>
              </Typography>            
            ) : (
              cliente.map((cliente) => (
                <Grid item xs={6} sm={6} key={cliente.codigo}>
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: 2,
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                    onClick={() => handleSelectCliente(cliente)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
                        {cliente.nombres[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{`${cliente.nombres} ${cliente.apellidos}`}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Código: {cliente.codigo}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      Teléfono: {cliente.telefono}
                    </Typography>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
export default SeleccionCliente;