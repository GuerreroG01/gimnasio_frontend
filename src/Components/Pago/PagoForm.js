import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pagoService from '../../Services/PagoService';
import { TextField, Button, Grid, Container, Typography, Alert, Snackbar, IconButton, CircularProgress, ToggleButton, Select, InputLabel, FormControl, ToggleButtonGroup, MenuItem } from '@mui/material';
import { Payment, AttachMoney, Edit, EditOff, CalendarToday } from '@mui/icons-material';
import SeleccionUsuario from './SeleccionUsuario';
import UsuarioService from '../../Services/UsuarioService';
import FechasUsuarioService from '../../Services/FechasUsuarioService';
import TipoEjercicioService from '../../Services/Tipo_EjercicioService';
import FechaVencimiento from './FechaVencimiento';

const PagoForm = ({ usuarioId }) => {
  const { id } = useParams();
  const ahora = new Date();
  const fechaLocal = ahora.toLocaleDateString('es-ES', {
      timeZone: 'America/Managua',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  }).split('/').reverse().join('-');
  const [pagoData, setPagoData] = useState({
    CodigoUsuario: '',
    MesesPagados: '',
    FechaPago: fechaLocal,
    Monto: '',
    DetallePago: ''
  });
  const [selectedUserName, setSelectedUserName] = useState('');
  const [showSeleccionUsuario, setShowSeleccionUsuario] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rangoPagoUnidad, setRangoPagoUnidad] = useState('dias');
  const [errorMessage, setErrorMessage] = useState('');
  const [diasSeleccionados, setDiasSeleccionados] = useState(7);
  const navigate = useNavigate();
  const [initialUserId] = useState(usuarioId || '');
  const [userEditedSelect, setUserEditedSelect] = useState(false);

  useEffect(() => {
    const fetchTipoEjercicios = async () => {
      try {
        const tipoEjercicios = await TipoEjercicioService.getTipoEjercicios();
        if (!tipoEjercicios) return;

        let costo = 0;

        if (!editMode) {
          console.log('Vamos a recalcular el costo del pago');
          tipoEjercicios.forEach(te => {
            const codigoTipoEjercicio = te.codigo;

            if (pagoData.MesesPagados === 7 && codigoTipoEjercicio === 16) {
              costo = te.costo;
            } else if (pagoData.MesesPagados === 15 && codigoTipoEjercicio === 20) {
              costo = te.costo;
            } else if (rangoPagoUnidad === 'meses' && codigoTipoEjercicio === 19) {
              costo = te.costo;
            }
          });
        } else if (userEditedSelect) {
          tipoEjercicios.forEach(te => {
            const descripcion = te.descripcion.trim().toLowerCase();

            if (pagoData.MesesPagados === 7 && descripcion === "semana") {
              costo = te.costo;
            } else if (pagoData.MesesPagados === 15 && descripcion === "15 dias") {
              costo = te.costo;
            } else if (rangoPagoUnidad === 'meses' && descripcion === "mes") {
              costo = te.costo;
            }
          });
        } else {
          return;
        }

        if (rangoPagoUnidad === 'meses' && costo !== 0) {
          setPagoData(prevData => ({
            ...prevData,
            Monto: costo * pagoData.MesesPagados
          }));
        } else if (costo !== 0) {
          setPagoData(prevData => ({
            ...prevData,
            Monto: costo
          }));
        }

      } catch (error) {
        console.error('Error al obtener los tipos de ejercicios', error);
      }
    };

    fetchTipoEjercicios();
  }, [pagoData.MesesPagados, rangoPagoUnidad, editMode, userEditedSelect]);

  const handleSelectUsuario = useCallback(async (codigoUsuario, userName) => {
    setPagoData(prevData => ({
      ...prevData,
      CodigoUsuario: codigoUsuario
    }));
    setSelectedUserName(userName);
    setShowSeleccionUsuario(false);
  
    if (!editMode) {
      try {
        const ultimoPago = await pagoService.getUltimoPagoPorUsuario(codigoUsuario);
        
        if (ultimoPago && ultimoPago.monto) {
          setPagoData((prevData) => ({
            ...prevData,
            MesesPagados: ultimoPago.mesesPagados,
            Monto: ultimoPago.monto,
            intervaloPago: ultimoPago.intervaloPago
          }));
          console.log('Datos actualizados en PagoData:', {
            MesesPagados: ultimoPago.mesesPagados,
            Monto: ultimoPago.monto,
            intervaloPago: ultimoPago.intervaloPago
          });
          if (ultimoPago.mesesPagados === 7) {
            setDiasSeleccionados(7);
          } else if (ultimoPago.mesesPagados === 15) {
            setDiasSeleccionados(15);
          } else {
            setDiasSeleccionados(ultimoPago.mesesPagados);
          }
          if (ultimoPago.intervaloPago === true) {
            setRangoPagoUnidad("meses");
          } else {
            setRangoPagoUnidad("dias");
          }
        } else {
          console.log('No se encontraron datos de pago previos para este usuario.');
          setRangoPagoUnidad("dias");
          setDiasSeleccionados(7);
          const monto = await calculosemana(7);
          setPagoData(prevData => ({
            ...prevData,
            Monto: monto
          }));
          console.log('Configurando valores predeterminados para un nuevo usuario.');
        }
      } catch (error) {
        console.error("Error al obtener el último pago:", error);
        setRangoPagoUnidad("dias");
        setDiasSeleccionados(7);
  
        const monto = await calculosemana(7);
        setPagoData(prevData => ({
          ...prevData,
          MesesPagados: 7,
          Monto: monto
        }));
      }
    }
  },[editMode]);
  useEffect(() => {
    const cargarUsuarioInicial = async () => {
      if (!editMode && initialUserId) {
        try {
          const userResponse = await UsuarioService.getUsuarioById(initialUserId);
          if (userResponse && userResponse.data) {
            const user = userResponse.data;
            const userName = `${user.nombres} ${user.apellidos}`;
            await handleSelectUsuario(initialUserId, userName);
          } else {
            console.warn('No se encontró usuario con el ID recibido.');
          }
        } catch (error) {
          console.error('Error al cargar el usuario inicial:', error);
        }
      }
    };

    cargarUsuarioInicial();
  }, [initialUserId, editMode, handleSelectUsuario]);
  
  useEffect(() => {
  
    if (pagoData.MesesPagados === 1) {
      setRangoPagoUnidad('meses');
    } else if (pagoData.MesesPagados === 7) {
      setRangoPagoUnidad('dias');
    } else if (pagoData.MesesPagados === 15) {
      setRangoPagoUnidad('dias');
    }
  }, [pagoData.MesesPagados]);
  
  useEffect(() => {
    if (!editMode) {
      if (rangoPagoUnidad === 'meses') {
        setPagoData(prevData => ({
          ...prevData,
          MesesPagados: 1
        }));
      } else if (rangoPagoUnidad === 'dias') {
        setPagoData(prevData => ({
          ...prevData,
          MesesPagados: diasSeleccionados
        }));
      }
    }
  }, [rangoPagoUnidad, diasSeleccionados, editMode]);
  useEffect(() => {
    if (editMode && pagoData.MesesPagados) {
      if (pagoData.MesesPagados === 7) {
        setDiasSeleccionados(7);
      } else if (pagoData.MesesPagados === 15) {
        setDiasSeleccionados(15);
      } else {
        setDiasSeleccionados(pagoData.MesesPagados);
      }
    }
  }, [editMode, pagoData.MesesPagados]);
  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchPago = async () => {
        try {
          const response = await pagoService.getPagoById(id);
          console.log('Informacion recibida del pago',response);
          if (response && response.codigoPago !== undefined) {
            const mappedData = {
              CodigoPago: response.codigoPago,
              CodigoUsuario: response.codigoUsuario,
              MesesPagados: response.mesesPagados,
              MesesPagadosA: response.mesesPagadosA || 0,
              FechaPago: response.fechaPago ? response.fechaPago.split('T')[0] : '',
              Monto: response.monto,
              DetallePago: response.detallePago,
              intervaloPago: response.intervaloPago
            };
            setPagoData(mappedData);
            setUserEditedSelect(false);
            if (response.intervaloPago) {
              setRangoPagoUnidad("meses");
            } else {
              setRangoPagoUnidad("dias");
            }
            const userResponse = await UsuarioService.getUsuarioById(response.codigoUsuario);
            if (userResponse && userResponse.data && userResponse.data.nombres && userResponse.data.apellidos) {
              setSelectedUserName(`${userResponse.data.nombres} ${userResponse.data.apellidos}`);
            } else {
              console.error('No se pudo obtener el nombre del usuario.');
              setErrorMessage('No se pudo obtener el nombre del usuario.');
            }
          }
        } catch (error) {
          console.error('Error al obtener el pago o el usuario:', error);
          setErrorMessage('Hubo un error al obtener los datos del pago o usuario.');
        }
      };
      fetchPago();
    }
  }, [id]);     

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPagoData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };  
  
  const calculosemana = async (dias) => {
    let costo = 0;
    try {
      const tipoEjercicios = await TipoEjercicioService.getTipoEjercicios();
      if (tipoEjercicios) {
        tipoEjercicios.forEach(te => {
          const descripcionTipoEjercicio = te.codigo;
          if (dias === 7 && descripcionTipoEjercicio === 16) {
            costo = te.costo;
          }
        });
      }
    } catch (error) {
      console.error('Error al obtener los tipos de ejercicios para calcular monto', error);
    }
  
    return costo;
  };     
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const fechaPago = new Date(pagoData.FechaPago);
        if (isNaN(fechaPago)) {
            console.error('Fecha de pago no válida', fechaPago);
            setErrorMessage('Fecha de pago no válida');
            setLoading(false);
            return;
        }

        const rangoPago = parseInt(pagoData.MesesPagados, 10);
        if (isNaN(rangoPago)) {
            setErrorMessage('Rango de pago debe ser un número válido');
            setLoading(false);
            return;
        }

        let intervaloPago = 0;
        if (rangoPagoUnidad === 'meses') {
            intervaloPago = 1;
        } else if (rangoPagoUnidad === 'dias') {
            intervaloPago = 0;
        }

        const usuarioId = pagoData.CodigoUsuario;

        if (editMode) {
            const fechaExistente = await pagoService.checkFechaUsuarioExist(usuarioId, pagoData.FechaPago);
            let mensajeAdicional = 'Este Pago no estaba en el registro de fechas_usuario pero ha sido agregado en el historial de fechas de pagos';

            if (!fechaExistente) {
                const fechasData = {
                    UsuarioId: pagoData.CodigoUsuario,
                    FechaPago: pagoData.FechaPago,
                    FechaPagoA: pagoData.FechaPago,
                    FechaVencimiento: pagoData.FechaPago,
                };

                mensajeAdicional = 'Este pago no aparece en los detalles del usuario, se ha ingresado en los detalles del usuario.';
                console.log("Datos enviados a FechasUsuarioService para creación:", fechasData);
                await FechasUsuarioService.createFecha(fechasData);
            }

            console.log(mensajeAdicional);
        }

        let diasRestantes = 0;
        let ultimoPago = null;
        let fechaVencimientoUltimoPago = null;

        try {
            const ultimoPago = await pagoService.getUltimoPagoVigente(usuarioId, editMode);

            if (ultimoPago && ultimoPago.message === "El usuario no tiene un pago anterior." && !editMode) {
                console.log('Cliente nuevo, no hay último pago.');
                diasRestantes = 0;
                fechaVencimientoUltimoPago = new Date(pagoData.FechaPago);
                console.log('Fecha de vencimiento establecida para nuevo cliente:', fechaVencimientoUltimoPago);
            } else if (editMode && ultimoPago && ultimoPago.fechaVencimiento) {
                fechaVencimientoUltimoPago = new Date(ultimoPago.fechaVencimiento);
                console.log('Último pago obtenido para editar:', ultimoPago);
                diasRestantes = ultimoPago.diasRestantes;
            } else {
                console.log('No se encontró un último pago válido, calculando desde el pago actual.');
                fechaVencimientoUltimoPago = new Date(pagoData.FechaPago);
            }
        } catch (error) {
            console.error("Error al obtener el último pago vigente:", error);
            setErrorMessage('Hubo un error al obtener el último pago vigente.');
            setLoading(false);
            return;
        }

        let fechaVencimiento = new Date(fechaVencimientoUltimoPago);
        if (diasRestantes > 0 && fechaVencimiento) {
            if (rangoPagoUnidad === 'dias') {
                fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago - 1);
            } else if (rangoPagoUnidad === 'meses') {
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
                fechaVencimiento.setDate(fechaVencimiento.getDate() - 1);
            }
        } else {
            fechaVencimiento = new Date(fechaPago);
            if (rangoPagoUnidad === 'dias') {
                fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago);
            } else if (rangoPagoUnidad === 'meses') {
                fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
            }
        }

        fechaVencimiento.setHours(0, 0, 0, 0);

        if (isNaN(fechaVencimiento)) {
            setErrorMessage('Fecha de vencimiento calculada no válida');
            setLoading(false);
            return;
        }

        fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);

        const fechasData = {
            UsuarioId: pagoData.CodigoUsuario,
            FechaPago: pagoData.FechaPago,
            FechaPagoA: pagoData.FechaPago,
            FechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        };

        const datosPago = {
            ...pagoData,
            intervaloPago,
        };

        if (editMode) {
            if (!pagoData.CodigoPago) {
                setErrorMessage('El ID del pago es necesario para actualizar.');
                setLoading(false);
                return;
            }
            console.log("Datos enviados a FechasUsuarioService para actualización:", fechasData);
            console.log("Datos enviados a updatePago:", datosPago);
            await pagoService.updateFecha(fechasData);
            await pagoService.updatePago(pagoData.CodigoPago, datosPago);
        } else {
            console.log("Datos enviados a FechasUsuarioService para creación:", fechasData);
            await FechasUsuarioService.createFecha(fechasData);
            await pagoService.createPago(datosPago);
        }

        navigate('/pagos');

        setPagoData({
            CodigoUsuario: '',
            MesesPagados: '',
            FechaPago: new Date().toISOString().split('T')[0],
            monto: ultimoPago ? parseFloat(ultimoPago.monto) || '' : '',
            DetallePago: '',
        });
        setSelectedUserName('');
    } catch (error) {
        if (error.response) {
            console.error('Respuesta del error:', error.response);
            setErrorMessage(error ? error : 'Hubo un error al procesar el pago.');
        } else {
            console.error('Error general:', error);
            setErrorMessage(error);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleClickEditIcon = () => {
    setShowSeleccionUsuario((prev) => !prev);
  };

  const handleRangoPagoUnidadChange = (event, newValue) => {
    if (newValue !== null) {
      setRangoPagoUnidad(newValue);
    }
  };

  const handleDiasSeleccionados = (event) => {
    const value = event.target.value;
    setDiasSeleccionados(value);
    if (value === "Otro") {
      setPagoData(prevData => ({
        ...prevData
      }));
    } else {
      setPagoData(prevData => ({
        ...prevData,
        MesesPagados: value
      }));
    }
  };  
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Container
          maxWidth="sm"
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            boxShadow: 3,
            padding: 4,
            marginTop: 3
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: 'bold', color: '#333' }}
          >
            {editMode ? 'Editar Pago' : 'Registrar Pago'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Usuario"
                  variant="outlined"
                  fullWidth
                  name="CodigoUsuario"
                  value={selectedUserName}
                  onChange={handleChange}
                  required
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  InputProps={{
                    disabled: true,
                    endAdornment: !editMode && (
                      <IconButton
                        onClick={handleClickEditIcon}
                        sx={{ color: '#6c757d' }}
                      >
                        {showSeleccionUsuario ? <Edit /> : <EditOff />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ToggleButtonGroup
                  value={rangoPagoUnidad}
                  exclusive
                  onChange={handleRangoPagoUnidadChange}
                  fullWidth
                  sx={{
                    display: 'flex',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                    '& .MuiToggleButton-root': {
                      flex: 1,
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'text.primary',
                      border: 'none',
                      transition: 'background-color 0.3s',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ToggleButton value="meses">Meses</ToggleButton>
                  <ToggleButton value="dias">Días</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {rangoPagoUnidad === 'dias' && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Seleccione días</InputLabel>
                    <Select
                      value={diasSeleccionados === "Otro" ? "Otro" : diasSeleccionados}
                      onChange={(e) => {
                        setUserEditedSelect(true);
                        handleDiasSeleccionados(e);
                      }}
                      label="Seleccione días"
                    >
                      {[7, 15].map((dia) => (
                        <MenuItem key={dia} value={dia}>
                          {dia} Día(s)
                        </MenuItem>
                      ))}
                      <MenuItem
                        value={(pagoData.MesesPagados === 7 || pagoData.MesesPagados === 15) ? 0 : pagoData.MesesPagados}
                        onClick={() => {
                          if (pagoData.MesesPagados === 7 || pagoData.MesesPagados === 15) {
                            setPagoData(prevData => ({
                              ...prevData,
                              MesesPagados: 0,
                              Monto: 0
                            }));
                          }
                        }}
                      >
                        Otro
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Meses Pagados (Aeróbicos)"
                  variant="outlined"
                  fullWidth
                  name="MesesPagadosA"
                  value={pagoData.MesesPagadosA}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <Payment sx={{ color: '#6c757d' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={rangoPagoUnidad === 'meses' ? 'Meses a Pagar' : 'Días a Pagar'}
                  variant="outlined"
                  fullWidth
                  name="MesesPagados"
                  value={pagoData.MesesPagados}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <Payment sx={{ color: '#6c757d' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Pago"
                  variant="outlined"
                  fullWidth
                  type="date"
                  name="FechaPago"
                  value={pagoData.FechaPago}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ color: '#6c757d' }} />,
                    disabled: editMode,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monto"
                  variant="outlined"
                  fullWidth
                  name="Monto"
                  value={pagoData.Monto || ''}
                  onChange={(e) => setPagoData({ ...pagoData, Monto: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: '#6c757d' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Detalle de Pago"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  name="DetallePago"
                  value={pagoData.DetallePago}
                  onChange={handleChange}
                  sx={{ marginTop: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (editMode ? 'Actualizar Pago' : 'Pagar')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Grid>

      <Grid item xs={12} md={6}>
        <Container sx={{ position: 'relative', paddingTop: 5 }}>
          {showSeleccionUsuario  && (
            <SeleccionUsuario
              onSelectUsuario={handleSelectUsuario}
            />
          )}
          <Snackbar
            open={errorMessage !== ''}
            autoHideDuration={5000}
            onClose={() => setErrorMessage('')}
          >
            <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
              {typeof errorMessage === 'string' ? errorMessage : 'Hubo un error'}
            </Alert>
          </Snackbar>
          <FechaVencimiento
            usuarioId={pagoData.CodigoUsuario}
            fechaPago={pagoData.FechaPago}
            mesesPagados={pagoData.MesesPagados}
            rangoPagoUnidad={rangoPagoUnidad}
          />
        </Container>
      </Grid>
    </Grid>
  );
};
export default PagoForm;