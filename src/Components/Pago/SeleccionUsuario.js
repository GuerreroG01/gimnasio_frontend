import React, { useState } from 'react';
import { TextField, Grid, Card, CardContent, CardHeader, Avatar, Box, Typography, CircularProgress, IconButton, InputAdornment, Chip } from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import UsuarioService from '../../Services/UsuarioService';

const SeleccionUsuario = ({ onSelectUsuario }) => {
  const [searchName, setSearchName] = useState('');
  const [searchSurname, setSearchSurname] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

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
      setUsuarios([]);
      setLoading(false);
      return;
    }

    if (type === 'code' && searchCode) {
      UsuarioService.getUsuarioById(searchCode)
        .then((response) => {
          setUsuarios([response.data]);
        })
        .catch((error) => {
          console.error('Error al buscar usuario por código:', error);
          setUsuarios([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (type === 'name' || type === 'surname') {
      if (searchName && searchSurname) {
        UsuarioService.buscarUsuarios(searchName, searchSurname)
          .then((response) => {
            setUsuarios(response.data);
          })
          .catch((error) => {
            console.error('Error al buscar usuarios por nombre y apellido:', error);
            setUsuarios([]);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        if (searchName) {
          UsuarioService.buscarUsuarios(searchName, '')
            .then((response) => {
              setUsuarios(response.data);
            })
            .catch((error) => {
              console.error('Error al buscar usuarios por nombre:', error);
              setUsuarios([]);
            })
            .finally(() => {
              setLoading(false);
            });
        } else if (searchSurname) {
          UsuarioService.buscarUsuarios('', searchSurname)
            .then((response) => {
              setUsuarios(response.data);
            })
            .catch((error) => {
              console.error('Error al buscar usuarios por apellido:', error);
              setUsuarios([]);
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
      setUsuarios([]);
      setLoading(false);
    } else {
      setLoading(true);
  
      const searchPromises = [];
  
      if (newFilters.some(filter => filter.type === 'code') && searchCode) {
        searchPromises.push(UsuarioService.getUsuarioById(searchCode));
      }
      if (newFilters.some(filter => filter.type === 'name') && searchName) {
        searchPromises.push(UsuarioService.buscarUsuarios(searchName, ''));
      }
      if (newFilters.some(filter => filter.type === 'surname') && searchSurname) {
        searchPromises.push(UsuarioService.buscarUsuarios('', searchSurname));
      }
      Promise.all(searchPromises)
        .then((responses) => {
          const allUsuarios = responses.flatMap(response => response.data);
          setUsuarios(allUsuarios);
        })
        .catch((error) => {
          console.error('Error al buscar usuarios:', error);
          setUsuarios([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };      

  const handleSelectUsuario = (usuario) => {
    onSelectUsuario(usuario.codigo, `${usuario.nombres} ${usuario.apellidos}`);
  };

  return (
    <Card sx={{ maxWidth: 900, margin: 'auto', padding: 2 }}>
      <CardHeader subheader="Filtra los usuarios por nombre, apellido o código" />
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
                fullWidth
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
                fullWidth
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
            {usuarios.length === 0 ? (
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
              usuarios.map((usuario) => (
                <Grid item xs={12} sm={6} key={usuario.codigo}>
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
                    onClick={() => handleSelectUsuario(usuario)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                      <Avatar sx={{ width: 56, height: 56, marginRight: 2 }}>
                        {usuario.nombres[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{`${usuario.nombres} ${usuario.apellidos}`}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Código: {usuario.codigo}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="textSecondary">
                      Teléfono: {usuario.telefono}
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
export default SeleccionUsuario;