import React, { useState, useEffect } from 'react';
import { 
  Box, CircularProgress, Typography, Card, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Pagination, TableSortLabel, IconButton, useMediaQuery
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import AsistenciaService from '../../Services/AsistenciaService';
import ClienteService from '../../Services/ClienteService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AsistenciaContent = ({ year, month, day, yearLimit, monthLimit, dayLimit, showDateLimit }) => {
  const [asistance, setAsistance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; 
  const [orderBy, setOrderBy] = useState('codigo');
  const [order, setOrder] = useState('asc');
  const [fechaLimite, setFechaLimite] = useState(null);

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  useEffect(() => {
    const fetchAsistencias = async () => {
      if (year && month && day) {
        setLoading(true);
        setError(null);
        setPage(1);

        try {
          const fecha = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const fechaLimite = showDateLimit && yearLimit && monthLimit && dayLimit 
          ? `${yearLimit}-${String(monthLimit).padStart(2, '0')}-${String(dayLimit).padStart(2, '0')}` 
          : null;
          setFechaLimite(fechaLimite);
          const data = await AsistenciaService.getAsistenciasPorFecha(fecha, fechaLimite);
          console.log('Fechas de las asistencias', data);

          const asistenciaConUsuarios = await Promise.all(
            data.map(async (item) => {
              try {
                const usuarioResponse = await ClienteService.getClienteById(item.codigoCliente);
                const usuario = usuarioResponse.data;
                return {
                  ...item,
                  nombreCompleto: `${usuario.nombres} ${usuario.apellidos}`,
                };
              } catch (error) {
                return { ...item, nombreCompleto: 'Desconocido' };
              }
            })
          );

          setAsistance(asistenciaConUsuarios);
        } catch (err) {
          setError('Hubo un problema al obtener las asistencias.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAsistencias();
  }, [year, month, day, yearLimit,monthLimit, dayLimit, showDateLimit]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const resetSort = () => {
    setOrderBy('codigo');
    setOrder('asc');
  };

  const sortedData = [...asistance].sort((a, b) => {
    if (orderBy === 'codigo') return order === 'asc' ? a.codigo - b.codigo : b.codigo - a.codigo;
    if (orderBy === 'nombreCompleto') return order === 'asc' ? a.nombreCompleto.localeCompare(b.nombreCompleto) : b.nombreCompleto.localeCompare(a.nombreCompleto);
    if (orderBy === 'hora') return order === 'asc' ? a.hora.localeCompare(b.hora) : b.hora.localeCompare(a.hora);
    return 0;
  });
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'No proporcionado';
    const date = dateString.includes('T') ? new Date(dateString) : new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return format(date, 'dd MMMM yyyy', { locale: es });
  };
  const totalPages = Math.ceil(asistance.length / rowsPerPage);
  const isSorted = orderBy !== 'codigo';
  console.log("Fecha seleccionada:", `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  return (
    <Box sx={{ px: 3, mt: -2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3, textAlign: 'center' }}>
        {fechaLimite ? 
          `Asistencia del ${formatDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
          al ${formatDate(`${yearLimit}-${String(monthLimit).padStart(2, '0')}-${String(dayLimit).padStart(2, '0')}`)}` 
          : 
          `Asistencia del ${formatDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}`
        }
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Card sx={{ backgroundColor: '#ffebee', color: '#d32f2f', p: 2, mb: 2, textAlign: 'center' }}>
          <Typography variant="body1">{error}</Typography>
        </Card>
      )}

      {!loading && (!showDateLimit || (showDateLimit && !loading)) && asistance.length > 0 ? (
        <>
          {isSmallScreen ? (
            <Box>
              {sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item, index) => (
                <Card key={index} sx={{ mb: 2, p: 2, boxShadow: 3 }}>
                  <Typography variant="body2"><strong>Código:</strong> {item.codigo || 'N/A'}</Typography>
                  <Typography variant="body2"><strong>Nombre:</strong> {item.nombreCompleto}</Typography>
                  <Typography variant="body2"><strong>Fecha:</strong> {formatDate(item.fecha)}</Typography>
                  <Typography variant="body2"><strong>Hora:</strong> {item.hora || 'No registrada'}</Typography>
                </Card>
              ))}
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={resetSort} sx={{ transition: 'transform 0.2s ease', transform: isSorted ? 'scale(1.1)' : 'scale(1)' }}>
                  {isSorted ? <FilterListIcon fontSize="large" color="success" /> : <FilterListOffIcon fontSize="large" color="disabled" />}
                </IconButton>
              </Box>

              <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, mt: -9, overflowX: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código Usuario</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                        <TableSortLabel
                          active={orderBy === 'nombreCompleto'}
                          direction={order}
                          onClick={() => handleSort('nombreCompleto')}
                          sx={{ color: 'white' }}
                        >
                          Nombre Completo
                        </TableSortLabel>
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                        <TableSortLabel
                          active={orderBy === 'hora'}
                          direction={order}
                          onClick={() => handleSort('hora')}
                          sx={{ color: 'white' }}
                        >
                          Hora
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.codigo || 'N/A'}</TableCell>
                        <TableCell>{item.codigoCliente || 'Desconocido'}</TableCell>
                        <TableCell>{item.nombreCompleto}</TableCell>
                        <TableCell>{formatDate(item.fecha || 'No Disponible')}</TableCell>
                        <TableCell>{item.hora || 'No registrada'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handleChangePage} size="medium" color="primary" sx={{ my: 2 }} />
          </Box>
        </>
      ) : (
        !loading && <Typography sx={{ textAlign: 'center', color: 'gray', mt: 3 }}>No hay registros de asistencia para esta fecha.</Typography>
      )}
    </Box>
  );
};
export default AsistenciaContent;