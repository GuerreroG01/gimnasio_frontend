import React, { useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import PagoForm from "../../Components/Pago/PagoForm";
import pagoService from '../../Services/PagoService';
import ClienteService from '../../Services/ClienteService';
import TiempoPagoService from '../../Services/TiempoPagoService';
import TipoPagoService from '../../Services/Tipo_PagosService';

export default function FormPage() {
  const location = useLocation();
  const clienteIdFromLocation = location.state?.clienteId || null;

  const { id } = useParams();
  const navigate = useNavigate();

  const ahora = new Date();
  const fechaLocal = ahora.toLocaleDateString('es-ES', { timeZone: 'America/Managua', year: 'numeric', month: '2-digit', day: '2-digit' })
                        .split('/').reverse().join('-');

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
  const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = React.useState(null);
  const [tiposPago, setTiposPago] = React.useState([]);
  const [loadingTiposPago, setLoadingTiposPago] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');

  const fetchMonto = useCallback(async (meses, unidad) => {
    try {
      const tiposPagos = await TipoPagoService.getTipoPagos();
      if (!tiposPagos) return 0;

      const duracionNum = Number(meses);
      const tipoExacto = tiposPagos.find(tp => tp.unidadTiempo.toLowerCase() === unidad && tp.duracion === duracionNum);
      if (tipoExacto) return tipoExacto.monto;

      const tipoBase = tiposPagos.find(tp => tp.unidadTiempo.toLowerCase() === unidad && tp.duracion === 1);
      return tipoBase ? tipoBase.monto * duracionNum : 0;

    } catch (error) {
      console.error('Error al obtener tipos de pago', error);
      return 0;
    }
  }, []);

  const handleSelectCliente = useCallback(async (codigoCliente, userName) => {
    setPagoData(prev => ({ ...prev, CodigoCliente: codigoCliente }));
    setSelectedUserName(userName);
    setShowSeleccionCliente(false);

    if (editMode) return;

    try {
      let ultimoPago = null;
      try {
        ultimoPago = await pagoService.getUltimoPagoVigente(codigoCliente, editMode);
      } catch (err) {
        if (!(err.response && err.response.status === 404)) throw err;
      }

      if (ultimoPago) {
        const dias = [7, 15].includes(ultimoPago.mesesPagados) ? ultimoPago.mesesPagados : ultimoPago.mesesPagados;
        setDiasSeleccionados(dias);
        setRangoPagoUnidad(ultimoPago.intervaloPago ? 'meses' : 'dias');
        setPagoData(prev => ({
          ...prev,
          MesesPagados: ultimoPago.mesesPagados,
          Monto: ultimoPago.monto,
          intervaloPago: ultimoPago.intervaloPago
        }));
      } else {
        setRangoPagoUnidad('dias');
        setDiasSeleccionados(7);
        const monto = await fetchMonto(7, 'dias');
        setPagoData(prev => ({ ...prev, Monto: monto }));
      }
    } catch (error) {
      console.error('Error al obtener último pago:', error);
      setRangoPagoUnidad('dias');
      setDiasSeleccionados(7);
      const monto = await fetchMonto(7, 'dias');
      setPagoData(prev => ({ ...prev, MesesPagados: 7, Monto: monto }));
    }
  }, [editMode, fetchMonto]);

  useEffect(() => {
    if (!editMode && clienteIdFromLocation) {
      ClienteService.getClienteById(clienteIdFromLocation)
        .then(res => {
          if (res?.data) handleSelectCliente(clienteIdFromLocation, `${res.data.nombres} ${res.data.apellidos}`);
        })
        .catch(err => console.error('Error al cargar cliente inicial', err));
    }
  }, [clienteIdFromLocation, editMode, handleSelectCliente]);

  useEffect(() => {
    if (!tipoPagoSeleccionado) fetchMonto(pagoData.MesesPagados, rangoPagoUnidad).then(monto => setPagoData(prev => ({ ...prev, Monto: monto })));
  }, [pagoData.MesesPagados, rangoPagoUnidad, tipoPagoSeleccionado, fetchMonto]);

  useEffect(() => {
    if (!editMode) setPagoData(prev => ({ ...prev, MesesPagados: rangoPagoUnidad === 'meses' ? 1 : diasSeleccionados }));
  }, [rangoPagoUnidad, diasSeleccionados, editMode]);

  useEffect(() => {
    if (id) {
      setEditMode(true);
      (async () => {
        try {
          const pago = await pagoService.getPagoById(id);
          if (!pago) return;
          setPagoData({
            CodigoPago: pago.codigoPago,
            CodigoCliente: pago.codigoCliente,
            MesesPagados: pago.mesesPagados,
            FechaPago: pago.fechaPago?.split('T')[0] || '',
            Monto: pago.monto,
            DetallePago: pago.detallePago,
            intervaloPago: pago.intervaloPago
          });
          setRangoPagoUnidad(pago.intervaloPago ? 'meses' : 'dias');
          const user = await ClienteService.getClienteById(pago.codigoCliente);
          if (user?.data) setSelectedUserName(`${user.data.nombres} ${user.data.apellidos}`);
        } catch (error) {
          console.error('Error al cargar pago/cliente', error);
          setErrorMessage('Error al cargar pago o cliente');
        }
      })();
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'MesesPagados') setTipoPagoSeleccionado(null);
    setPagoData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const rango = parseInt(pagoData.MesesPagados, 10);
      if (!pagoData.FechaPago || isNaN(new Date(pagoData.FechaPago)) || isNaN(rango)) {
        setErrorMessage('Datos inválidos');
        setLoading(false);
        return;
      }

      const datosPago = {
        CodigoPago: pagoData.CodigoPago,
        CodigoCliente: pagoData.CodigoCliente,
        MesesPagados: rango,
        FechaPago: pagoData.FechaPago,
        Monto: pagoData.Monto,
        DetallePago: pagoData.DetallePago,
        IntervaloPago: rangoPagoUnidad === 'meses' ? 1 : 0
      };

      const pagoGuardado = editMode
        ? await pagoService.updatePago(pagoData.CodigoPago, datosPago)
        : await pagoService.createPago(datosPago);

      const codigoPago = editMode ? pagoData.CodigoPago : pagoGuardado.codigoPago;

      // Calcular fecha de vencimiento
      let fechaBase = new Date(pagoData.FechaPago);
      try {
        const ultimoPago = await pagoService.getUltimoPagoVigente(pagoData.CodigoCliente, editMode);
        if (ultimoPago?.fechaVencimiento) fechaBase = new Date(ultimoPago.fechaVencimiento);
      } catch {}
      
      const fechaVencimiento = new Date(fechaBase);
      if (rangoPagoUnidad === 'dias') fechaVencimiento.setDate(fechaVencimiento.getDate() + rango);
      else fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rango);

      const tiempoPagoRecords = await TiempoPagoService.getFechasByClienteId(pagoData.CodigoCliente);
      const tiempoPagoExistente = tiempoPagoRecords.data.find(tp => tp.codigoPago === codigoPago);
      const tiempoPagoData = {
        ClienteId: pagoData.CodigoCliente,
        CodigoPago: codigoPago,
        FechaPago: pagoData.FechaPago,
        FechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
      };
      if (tiempoPagoExistente) tiempoPagoData.Id = tiempoPagoExistente.id;

      if (editMode) await TiempoPagoService.updateByPago(tiempoPagoData.Id, tiempoPagoData);
      else await TiempoPagoService.createFecha(tiempoPagoData);

      navigate('/pagos');
      setPagoData({ CodigoCliente: '', MesesPagados: '', FechaPago: new Date().toISOString().split('T')[0], Monto: '', DetallePago: '' });
      setSelectedUserName('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleClickEditIcon = () => setShowSeleccionCliente(prev => !prev);
  const handleRangoPagoUnidadChange = (_, newValue) => { if (newValue !== null) { setTipoPagoSeleccionado(null); setRangoPagoUnidad(newValue); } };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText?.length >= 2) {
        TipoPagoService.searchTipoPagoByName(searchText)
          .then(res => setTiposPago(res.data))
          .catch(console.error)
          .finally(() => setLoadingTiposPago(false));
      } else setTiposPago([]);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return (
    <PagoForm
      clienteId={clienteIdFromLocation}
      editMode={editMode}
      handleSubmit={handleSubmit}
      selectedUserName={selectedUserName}
      handleClickEditIcon={handleClickEditIcon}
      showSeleccionCliente={showSeleccionCliente}
      rangoPagoUnidad={rangoPagoUnidad}
      diasSeleccionados={diasSeleccionados}
      setDiasSeleccionados={setDiasSeleccionados}
      setUserEditedSelect={setTipoPagoSeleccionado}
      handleChange={handleChange}
      pagoData={pagoData}
      setPagoData={setPagoData}
      loading={loading}
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage}
      handleSelectCliente={handleSelectCliente}
      handleRangoPagoUnidadChange={handleRangoPagoUnidadChange}
      loadingTiposPago={loadingTiposPago}
      tiposPago={tiposPago}
      searchText={searchText}
      setSearchText={setSearchText}
      tipoPagoSeleccionado={tipoPagoSeleccionado}
      setTipoPagoSeleccionado={setTipoPagoSeleccionado}
    />
  );
}