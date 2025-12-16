import PagoForm from "../../Components/Pago/PagoForm";
import { useLocation } from "react-router-dom";
import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pagoService from '../../Services/PagoService';
import ClienteService from '../../Services/ClienteService';
import TiempoPagoService from '../../Services/TiempoPagoService';
import TipoPagoService from '../../Services/Tipo_PagosService';

export default function FormPage() {
  // Sección Cliente desde detalles
  const location = useLocation();
  const clienteId = location.state?.clienteId || null;

  //Funcionamiento de Registro de Pagos
  const { id } = useParams();
  const ahora = new Date();
  const fechaLocal = ahora.toLocaleDateString('es-ES', {
      timeZone: 'America/Managua',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  }).split('/').reverse().join('-');
  const [pagoData, setPagoData] = React.useState({
    CodigoCliente: '',
    MesesPagados: '',
    FechaPago: fechaLocal,
    Monto: '',
    DetallePago: ''
  });
  const [selectedUserName, setSelectedUserName] = React.useState('');
  const [showSeleccionCliente, setShowSeleccionCliente] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [rangoPagoUnidad, setRangoPagoUnidad] = React.useState('dias');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [diasSeleccionados, setDiasSeleccionados] = React.useState(7);
  const navigate = useNavigate();
  const [initialUserId] = React.useState(clienteId || '');
  const [userEditedSelect, setUserEditedSelect] = React.useState(false);

  useEffect(() => {
    const fetchTipoPagos = async () => {
      try {
        const tiposPagos = await TipoPagoService.getTipoPagos();
        if (!tiposPagos) return;

        const duracionNum = Number(pagoData.MesesPagados);
        let costo = 0;

        const tipoPagoExacto = tiposPagos.find(tp => {
          const unidad = tp.unidadTiempo.toLowerCase();
          if (rangoPagoUnidad === 'dias' && unidad === 'dias') return tp.duracion === duracionNum;
          if (rangoPagoUnidad === 'meses' && unidad === 'meses') return tp.duracion === duracionNum;
          return false;
        });

        if (tipoPagoExacto) {
          costo = tipoPagoExacto.monto;
        } else {
          const tipoBase = tiposPagos.find(tp => {
            const unidad = tp.unidadTiempo.toLowerCase();
            if (rangoPagoUnidad === 'dias' && unidad === 'dias') return tp.duracion === 1;
            if (rangoPagoUnidad === 'meses' && unidad === 'meses') return tp.duracion === 1;
            return false;
          });

          if (tipoBase) {
            costo = tipoBase.monto * duracionNum;
          }
        }

        setPagoData(prevData => ({
          ...prevData,
          Monto: costo
        }));

      } catch (error) {
        console.error('Error al obtener los tipos de pago', error);
      }
    };

    fetchTipoPagos();
  }, [pagoData.MesesPagados, rangoPagoUnidad, editMode, userEditedSelect]);

  const handleSelectCliente = useCallback(async (codigoCliente, userName) => {
    setPagoData(prevData => ({
      ...prevData,
      CodigoCliente: codigoCliente
    }));
    setSelectedUserName(userName);
    setShowSeleccionCliente(false);
  
    if (!editMode) {
      try {
        let ultimoPago = null;
        try {
            ultimoPago = await pagoService.getUltimoPagoVigente(clienteId, editMode);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Cliente sin pagos previos, se procederá a crear un nuevo registro.');
                ultimoPago = null;
            } else {
                throw error;
            }
        }
        if (ultimoPago && ultimoPago.monto) {
          setPagoData((prevData) => ({
            ...prevData,
            MesesPagados: ultimoPago.mesesPagados,
            Monto: ultimoPago.monto,
            intervaloPago: ultimoPago.intervaloPago
          }));

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
          console.log('No se encontraron datos de pago previos para este cliente.');
          setRangoPagoUnidad("dias");
          setDiasSeleccionados(7);
          const monto = await calculosemana(7);
          setPagoData(prevData => ({
            ...prevData,
            Monto: monto
          }));
          console.log('Configurando valores predeterminados para un nuevo cliente.');
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
    const cargarClienteInicial = async () => {
      if (!editMode && initialUserId) {
        try {
          const userResponse = await ClienteService.getClienteById(initialUserId);
          if (userResponse && userResponse.data) {
            const user = userResponse.data;
            const userName = `${user.nombres} ${user.apellidos}`;
            await handleSelectCliente(initialUserId, userName);
          } else {
            console.warn('No se encontró cliente con el ID recibido.');
          }
        } catch (error) {
          console.error('Error al cargar el cliente inicial:', error);
        }
      }
    };

    cargarClienteInicial();
  }, [initialUserId, editMode, handleSelectCliente]);
  
  useEffect(() => {
    if (pagoData.MesesPagados === 1) {
      setRangoPagoUnidad('meses');
    } else if (pagoData.MesesPagados === 7 || pagoData.MesesPagados === 15) {
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
          if (response && response.codigoPago !== undefined) {
            const mappedData = {
              CodigoPago: response.codigoPago,
              CodigoCliente: response.codigoCliente,
              MesesPagados: response.mesesPagados,
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
            const userResponse = await ClienteService.getClienteById(response.codigoCliente);
            if (userResponse && userResponse.data && userResponse.data.nombres && userResponse.data.apellidos) {
              setSelectedUserName(`${userResponse.data.nombres} ${userResponse.data.apellidos}`);
            } else {
              console.error('No se pudo obtener el nombre del cliente.');
              setErrorMessage('No se pudo obtener el nombre del cliente.');
            }
          }
        } catch (error) {
          console.error('Error al obtener el pago o el cliente:', error);
          setErrorMessage('Hubo un error al obtener los datos del pago o cliente.');
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
      const tiposPagos = await TipoPagoService.getTipoPagos();
      if (tiposPagos) {
        const tipoPago = tiposPagos.find(tp => 
          tp.unidadTiempo.toLowerCase() === 'dias' && tp.duracion === Number(dias)
        );

        if (tipoPago) {
          costo = tipoPago.monto;
        }
      }
    } catch (error) {
      console.error('Error al obtener los tipos de pago para calcular monto', error);
    }

    return costo;
  };    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fechaPago = new Date(pagoData.FechaPago);
      if (isNaN(fechaPago)) {
        setErrorMessage('Fecha de pago no válida');
        return;
      }

      const rangoPago = parseInt(pagoData.MesesPagados, 10);
      if (isNaN(rangoPago)) {
        setErrorMessage('Rango de pago inválido');
        return;
      }

      const intervaloPago = rangoPagoUnidad === 'meses' ? 1 : 0;
      const clienteId = pagoData.CodigoCliente;

      const datosPago = {
        CodigoPago: pagoData.CodigoPago,
        CodigoCliente: clienteId,
        MesesPagados: rangoPago,
        FechaPago: pagoData.FechaPago,
        Monto: pagoData.Monto,
        DetallePago: pagoData.DetallePago,
        IntervaloPago: intervaloPago
      };

      let codigoPago;

      if (editMode) {
        if (!pagoData.CodigoPago) {
          setErrorMessage('Código de pago requerido para editar');
          return;
        }

        await pagoService.updatePago(pagoData.CodigoPago, datosPago);
        codigoPago = pagoData.CodigoPago;
      } else {
        const pagoCreado = await pagoService.createPago(datosPago);
        codigoPago = pagoCreado.codigoPago;
      }

      let fechaBaseVencimiento = fechaPago;
      let diasRestantes = 0;

      try {
        const ultimoPago = await pagoService.getUltimoPagoVigente(clienteId, editMode);

        if (ultimoPago?.fechaVencimiento) {
          fechaBaseVencimiento = new Date(ultimoPago.fechaVencimiento);
          diasRestantes = ultimoPago.diasRestantes || 0;
        }
      } catch (error) {
        console.warn('No se pudo obtener último pago, se usará fecha actual');
      }

      let fechaVencimiento = new Date(fechaBaseVencimiento);

      if (diasRestantes > 0) {
        if (rangoPagoUnidad === 'dias') {
          fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago - 1);
        } else {
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
          fechaVencimiento.setDate(fechaVencimiento.getDate() - 1);
        }
      } else {
        if (rangoPagoUnidad === 'dias') {
          fechaVencimiento.setDate(fechaVencimiento.getDate() + rangoPago);
        } else {
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rangoPago);
        }
      }

      fechaVencimiento.setHours(0, 0, 0, 0);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 1);

      if (isNaN(fechaVencimiento)) {
        setErrorMessage('Fecha de vencimiento inválida');
        return;
      }

      const tiempoPagoRecords = await TiempoPagoService.getFechasByClienteId(clienteId);
      const tiempoPago = tiempoPagoRecords.data.find(tp => tp.codigoPago === codigoPago);
      let tiempoPagoData;
      if (tiempoPago) {
          tiempoPagoData = {
              Id: tiempoPago.id,
              ClienteId: clienteId,
              CodigoPago: codigoPago,
              FechaPago: pagoData.FechaPago,
              FechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
          };
      } else {
          tiempoPagoData = {
              ClienteId: clienteId,
              CodigoPago: codigoPago,
              FechaPago: pagoData.FechaPago,
              FechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
          };
      }
      if (editMode) {
        await TiempoPagoService.updateByPago(tiempoPagoData.Id,tiempoPagoData);
      } else {
        await TiempoPagoService.createFecha(tiempoPagoData);
      }

      navigate('/pagos');

      setPagoData({
        CodigoCliente: '',
        MesesPagados: '',
        FechaPago: new Date().toISOString().split('T')[0],
        Monto: '',
        DetallePago: ''
      });

      setSelectedUserName('');

    } catch (error) {
      console.error(error);
      setErrorMessage('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleClickEditIcon = () => {
    setShowSeleccionCliente((prev) => !prev);
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
    <PagoForm
    clienteId={clienteId} //Desde Detalles del cliente
    editMode={editMode} handleSubmit={handleSubmit}
    selectedUserName={selectedUserName} handleClickEditIcon={handleClickEditIcon}
    showSeleccionCliente={showSeleccionCliente} rangoPagoUnidad={rangoPagoUnidad}
    diasSeleccionados={diasSeleccionados} handleDiasSeleccionados={handleDiasSeleccionados}
    setUserEditedSelect={setUserEditedSelect} handleChange={handleChange}
    pagoData={pagoData} setPagoData={setPagoData} loading={loading} 
    errorMessage={errorMessage} setErrorMessage={setErrorMessage} 
    handleSelectCliente={handleSelectCliente} handleRangoPagoUnidadChange={handleRangoPagoUnidadChange}
    />
  );
}