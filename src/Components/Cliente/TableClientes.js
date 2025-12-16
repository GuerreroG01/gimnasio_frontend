import React from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import FechasUsuarioService from '../../Services/TiempoPagoService';
import TiempoPagoService from '../../Services/TiempoPagoService';

function Row({ usuario, onEdit, onDelete, onViewDetails }) {
  const [open, setOpen] = React.useState(false);
  const [fechasUsuario, setFechasUsuario] = React.useState([]);
  const [ultimoPago, setUltimoPago] = React.useState(null);

  React.useEffect(() => {
    if (open && !fechasUsuario.length) {
      const fetchFechas = async () => {
        try {
          const response = await TiempoPagoService.getFechasByClienteId(usuario.codigo);
          const datosFechas = response.data;
          setFechasUsuario(datosFechas);
          if (datosFechas.length > 0) {
            const ultimo = datosFechas.reduce((max, fecha) => 
              new Date(fecha.fechaPago) > new Date(max.fechaPago) ? fecha : max
            );
            setUltimoPago(ultimo);
          }
        } catch (error) {
          console.error('Error fetching fechas:', error);
        }
      };

      fetchFechas();
    }
  }, [open, usuario.codigo, fechasUsuario.length]);

  const calcularDiasRestantes = (fechaVencimiento) => {
    const fechaActual = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - fechaActual;
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
    return diasRestantes <= 0 ? 'Expirado' : `${diasRestantes - 1} días`;
  };

  const telefonoMostrar = usuario.telefono.trim() === '-' ? 'No proporcionado' : usuario.telefono;
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{usuario.codigo}</TableCell>
        <TableCell>{usuario.nombres}</TableCell>
        <TableCell>{usuario.apellidos}</TableCell>
        <TableCell>{telefonoMostrar}</TableCell>
        <TableCell>
          <Tooltip title="Ver detalles">
            <IconButton color="info" onClick={() => onViewDetails(usuario.codigo)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton color="primary" onClick={() => onEdit(usuario.codigo)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton color="secondary" onClick={() => onDelete(usuario)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Último Pago
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha Pago</TableCell>
                    <TableCell>Fecha Vencimiento</TableCell>
                    <TableCell>Días Restantes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ultimoPago ? (
                    <TableRow key={ultimoPago.id}>
                      <TableCell>{ultimoPago.fechaPago ? format(new Date(ultimoPago.fechaPago), 'dd MMM yyyy', { locale: es }) : 'N/A'}</TableCell>
                      <TableCell>{ultimoPago.fechaVencimiento ? format(new Date(ultimoPago.fechaVencimiento), 'dd MMM yyyy', { locale: es }) : 'N/A'}</TableCell>
                      <TableCell>{ultimoPago.fechaVencimiento ? calcularDiasRestantes(ultimoPago.fechaVencimiento) : 'N/A'}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>No hay pagos disponibles</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  usuario: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

const TableClientes = ({ usuarios, loading, page, rowsPerPage, onEdit, onDelete, onViewDetails }) => {
  const [sortConfig, setSortConfig] = React.useState({ key: 'fechaIngreso', direction: 'desc' });
  const [filterIcon, setFilterIcon] = React.useState(false);  // Para manejar el ícono de filtro

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    // Verifica si la ordenación es por 'nombres' o 'apellidos'
    if (key === 'nombres' || key === 'apellidos') {
      setFilterIcon(true);  // Muestra el ícono de filtro
    } else {
      setFilterIcon(false); // Si no es por nombres o apellidos, oculta el ícono de filtro
    }
  };

  const resetToDateSort = () => {
    setSortConfig({ key: 'fechaIngreso', direction: 'desc' });  // Restablece la ordenación a fecha de ingreso
    setFilterIcon(false);  // Oculta el ícono de filtro
  };

  const sortedUsuarios = [...usuarios].sort((a, b) => {
    if (sortConfig.key === 'fechaIngreso') {
      const fechaA = new Date(a.fechaIngreso);
      const fechaB = new Date(b.fechaIngreso);
      return sortConfig.direction === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    }

    if (sortConfig.key === 'nombres') {
      const nombreA = a.nombres.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const nombreB = b.nombres.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const comparison = nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    }

    if (sortConfig.key === 'apellidos') {
      const comparison = a.apellidos.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().localeCompare(b.apellidos.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(), 'es', { sensitivity: 'base' });
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    }

    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box display="flex" alignItems="center">
                <IconButton onClick={resetToDateSort} title="Restablecer a Orden Por Fecha de Inscripción">
                  {filterIcon ? <FilterListIcon /> : <FilterListOffIcon />}
                </IconButton>
              </Box>
            </TableCell>
            <TableCell>Código</TableCell>
            <TableCell>
              <IconButton onClick={() => handleSort('nombres')}>
                {sortConfig.key === 'nombres' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
              Nombres
            </TableCell>
            <TableCell>
              <IconButton onClick={() => handleSort('apellidos')}>
                {sortConfig.key === 'apellidos' && sortConfig.direction === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
              Apellidos
            </TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="rectangular" width={40} height={40} />
                </TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell>
                  <Skeleton variant="rectangular" width={150} height={40} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            sortedUsuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(usuario => (
              <Row
                key={usuario.codigo}
                usuario={usuario}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TableClientes.propTypes = {
  usuarios: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};
export default TableClientes;