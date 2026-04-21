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
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import PagoService from '../../Services/PagoService';

function Row({ usuario, onEdit, onDelete, onViewDetails }) {
  const [open, setOpen] = React.useState(false);
  const [fechasUsuario, setFechasUsuario] = React.useState([]);
  const [ultimoPago, setUltimoPago] = React.useState(null);

  React.useEffect(() => {
    if (open && usuario.codigo) {
      const fetchUltimoPago = async () => {
        try {
          const data = await PagoService.getUltimoPagoVigente(usuario.codigo);
          setUltimoPago(data);
        } catch (error) {
          console.error('Error fetching último pago:', error);
        }
      };

      fetchUltimoPago();
    }
  }, [open, usuario.codigo]);

  const calcularDiasRestantes = (fechaVencimiento) => {
    const fechaActual = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - fechaActual;
    const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));
    return diasRestantes <= 0 ? 'Expirado' : `${diasRestantes - 1} días`;
  };

  const telefonoMostrar = usuario.telefono?.trim() === '-' ? 'No proporcionado' : usuario.telefono;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
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
        <TableCell colSpan={6} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box m={1}>
              <Typography variant="h6">Último Pago</Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha Pago</TableCell>
                    <TableCell>Fecha Vencimiento</TableCell>
                    <TableCell>Días Restantes</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ultimoPago ? (
                    <TableRow>
                      <TableCell>
                        {ultimoPago.fechaPago
                          ? format(new Date(ultimoPago.fechaPago), 'dd MMM yyyy', { locale: es })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {ultimoPago.fechaVencimiento
                          ? format(new Date(ultimoPago.fechaVencimiento), 'dd MMM yyyy', { locale: es })
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {ultimoPago.fechaVencimiento
                          ? calcularDiasRestantes(ultimoPago.fechaVencimiento)
                          : 'N/A'}
                      </TableCell>
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

const TableClientes = ({ usuarios = [], loading, onEdit, onDelete, onViewDetails, onSort, ordenarPor,
  orden, resetFiltrado }) => {

  return (
    <TableContainer component={Paper}>
      <Table>

        <TableHead>
          <TableRow>
            <TableCell>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={resetFiltrado}
                  title="Restablecer ordenación a predeterminada"
                >
                  {ordenarPor ? <FilterListIcon /> : <FilterListOffIcon />}
                </IconButton>
              </Box>
            </TableCell>
            <TableCell>Código</TableCell>

            <TableCell>
              <IconButton onClick={() => onSort('nombres')}>
                {ordenarPor === 'nombres' && orden === 'asc'
                  ? <ArrowUpwardIcon />
                  : <ArrowDownwardIcon />}
              </IconButton>
              Nombres
            </TableCell>

            <TableCell>
              <IconButton onClick={() => onSort('apellidos')}>
                {ordenarPor === 'apellidos' && orden === 'asc'
                  ? <ArrowUpwardIcon />
                  : <ArrowDownwardIcon />}
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
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
                <TableCell><Skeleton /></TableCell>
              </TableRow>
            ))
          ) : (
            usuarios.map(usuario => (
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
  usuarios: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  ordenarPor: PropTypes.string,
  orden: PropTypes.string
};
export default TableClientes;