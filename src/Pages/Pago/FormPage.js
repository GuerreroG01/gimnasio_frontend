import React, { useEffect, useState, useRef } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import pagosService from '../../Services/PagoService';
import PagoForm from '../../Components/Pago/PagoForm';
import ClienteService from '../../Services/ClienteService';
import TiposPagoService from '../../Services/Tipo_PagosService';
import TipoCambioService from '../../Services/TipoCambioService';
import TiempoPagoService from '../../Services/TiempoPagoService';
import { convertirPrecio, obtenerMonedaEquivalente } from '../../Utils/MonedaUtils';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FormPage({ pagoId, onSuccess }) {
    const location = useLocation();
    const { clienteId } = location.state || {};
    const monedas = [
        { value: 'NIO', label: 'NIO' },
        { value: 'USD', label: 'USD' },
    ];
    const [clientes, setClientes] = React.useState([]);
    const [loadingClientes, setLoadingClientes] = useState(false);
    const [tiposPago, setTiposPago] = useState([]);
    const [loadingTiposPago, setLoadingTiposPago] = useState(false);
    const [loading, setLoading] = useState(false);
    let fechaActual = new Date();
    const fechaPago = new Date(fechaActual.getTime() - 6 * 60 * 60 * 1000);
    const [initialValues, setInitialValues] = useState({
        CodigoCliente: clienteId || '',
        MesesPagados: 1,
        FechaPago: fechaPago,
        Moneda: 'NIO',
        Efectivo: 0,
        Cambio: 0,
        Monto: 0,
        DetallePago: '',
        IntervaloPago: false,
    });
    const [montoBase, setMontoBase]= React.useState(0);
    const [tipoCambio, setTipoCambio] = React.useState([]); 
    const [cambioEquivalente, setCambioEquivalente] = React.useState(0);
    const navigate= useNavigate();

    const validationSchema = Yup.object({
        CodigoCliente: Yup.number().required('Cliente requerido'),
        MesesPagados: Yup.number().min(1, 'Debe ser al menos 1').required('Requerido'),
        FechaPago: Yup.date().required('Fecha requerida'),
        Moneda: Yup.string().required('Moneda requerida'),
        Efectivo: Yup.number().min(0, 'Debe ser >= 0').required('Requerido'),
        Monto: Yup.number().min(0, 'Debe ser >= 0').required('Requerido'),
        Cambio: Yup.number().min(0, 'Debe ser >= 0'),
        DetallePago: Yup.string().max(50, 'Máximo 50 caracteres'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            try {
                const rango = parseInt(values.MesesPagados, 10);
                if (!values.FechaPago || isNaN(new Date(values.FechaPago)) || isNaN(rango)) {
                    throw new Error('Datos inválidos');
                }

                const datosPago = {
                    CodigoPago: values.CodigoPago,
                    CodigoCliente: values.CodigoCliente,
                    MesesPagados: rango,
                    FechaPago: values.FechaPago,
                    Moneda: values.Moneda,
                    Efectivo: values.Efectivo,
                    Cambio: values.Cambio,
                    Monto: values.Monto,
                    DetallePago: values.DetallePago,
                    IntervaloPago: values.IntervaloPago ? 1 : 0
                };

                const pagoGuardado = pagoId
                    ? await pagosService.updatePago(pagoId, datosPago)
                    : await pagosService.createPago(datosPago);

                const codigoPago = pagoId ? values.CodigoPago : pagoGuardado.codigoPago;

                let fechaBase = new Date(values.FechaPago);
                try {
                    const ultimoPago = await pagosService.getUltimoPagoVigente(values.CodigoCliente, !!pagoId);
                    if (ultimoPago?.fechaVencimiento) fechaBase = new Date(ultimoPago.fechaVencimiento);
                } catch (err) {
                    console.warn('No se pudo obtener último pago vigente', err);
                }

                const fechaVencimiento = new Date(fechaBase);
                if (values.IntervaloPago === false) {
                    fechaVencimiento.setDate(fechaVencimiento.getDate() + rango);
                } else {
                    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + rango);
                }

                const tiempoPagoRecords = await TiempoPagoService.getFechasByClienteId(values.CodigoCliente);
                const tiempoPagoExistente = tiempoPagoRecords.data.find(tp => tp.codigoPago === codigoPago);
                const tiempoPagoData = {
                    ClienteId: values.CodigoCliente,
                    CodigoPago: codigoPago,
                    FechaPago: values.FechaPago,
                    FechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
                };
                if (tiempoPagoExistente) tiempoPagoData.Id = tiempoPagoExistente.id;

                if (tiempoPagoExistente) {
                    await TiempoPagoService.updateByPago(tiempoPagoData.Id, tiempoPagoData);
                } else {
                    await TiempoPagoService.createFecha(tiempoPagoData);
                }

                resetForm();
                onSuccess?.(pagoGuardado);
                navigate('/pagos');
            } catch (error) {
                console.error(error);
                alert(error.message || 'Error al procesar el pago');
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (pagoId) {
        setLoading(true);
        pagosService
            .getPagoById(pagoId)
            .then((data) => {
            setInitialValues({
                ...data,
                FechaPago: data.FechaPago ? new Date(data.FechaPago) : new Date(),
            });
            })
            .finally(() => setLoading(false));
        }
    }, [pagoId]);

    useEffect(() => {
        TipoCambioService.getTipoCambios()
            .then((data) => setTipoCambio(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (!montoBase) return;

        const montoConvertido = convertirPrecio(montoBase, 'NIO', formik.values.Moneda, tipoCambio);
        formik.setFieldValue("Monto", montoConvertido);
    }, [formik, formik.values.Moneda, tipoCambio, montoBase]);

    useEffect(() => {
        const efectivo = parseFloat(formik.values.Efectivo) || 0;
        const monto = parseFloat(formik.values.Monto) || 0;

        const cambio = Math.max(0, efectivo - monto);
        formik.setFieldValue("Cambio", cambio);

        const monedaDestino = obtenerMonedaEquivalente(formik.values.Moneda);
        const cambioEquivalente = convertirPrecio(cambio, formik.values.Moneda, monedaDestino, tipoCambio);
        setCambioEquivalente(cambioEquivalente);
    }, [formik, formik.values.Efectivo, formik.values.Monto, formik.values.Moneda, tipoCambio]);

    useEffect(() => {
        if (clienteId) {
            ClienteService.getClienteById(clienteId)
                .then((res) => {
                    const clienteData = res.data;
                    setClientes([clienteData]);
                    formik.setFieldValue('CodigoCliente', clienteData.codigo);
                })
                .catch(err => console.error(err));
        }
    }, [formik, clienteId]);

    const autocompleteDelay = 1000;
    const searchTimeout = useRef(null);

    const handleBuscarClienteDebounced = (inputValue) => {
        if (!inputValue) return;

        setLoadingClientes(true);

        ClienteService.buscarCliente(inputValue, '')
            .then((res) => {
            if (res.data.length > 0) {
                setClientes(res.data);
            } else {
                return ClienteService.buscarCliente('', inputValue).then((res2) => {
                setClientes(res2.data);
                });
            }
            })
            .finally(() => setLoadingClientes(false));
    };

    const handleInputChange = (event, value, reason) => {
        if (reason !== 'input') return;
        setLoadingClientes(true);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            handleBuscarClienteDebounced(value);
        }, autocompleteDelay);
    };
    const tipoPagoSearchTimeout = useRef(null);
    const handleBuscarTipoPagoDebounced = (inputValue) => {
        if (!inputValue) return;

        setLoadingTiposPago(true);
        TiposPagoService.searchTipoPagoByName(inputValue)
        .then((res) => setTiposPago(res.data))
        .finally(() => setLoadingTiposPago(false));
    };

    const handleTipoPagoInputChange = (event, value, reason) => {
        if (reason !== 'input') return;
        if (tipoPagoSearchTimeout.current) clearTimeout(tipoPagoSearchTimeout.current);
        setLoadingTiposPago(true);
        tipoPagoSearchTimeout.current = setTimeout(() => {
        handleBuscarTipoPagoDebounced(value);
        }, autocompleteDelay);
    };
    const handleTipoPagoChange = (event, value) => {
        if (!value) return;
        setMontoBase(value.monto);

        const montoConvertido = convertirPrecio(value.monto, 'NIO', formik.values.Moneda, tipoCambio);

        formik.setFieldValue("MesesPagados", value.unidadTiempo.toLowerCase() === "dias" ? value.duracion : value.duracion);
        formik.setFieldValue("Monto", montoConvertido);
        formik.setFieldValue('IntervaloPago', value.unidadTiempo.toLowerCase() === 'dias' ? false : true );
    };

    return (
        <PagoForm
            formik={formik}
            loading={loading}
            pagoId={pagoId}
            monedas={monedas}
            clientes={clientes}
            loadingClientes={loadingClientes}
            handleInputChange={handleInputChange}
            tiposPago={tiposPago}
            loadingTiposPago={loadingTiposPago}
            handleTipoPagoInputChange={handleTipoPagoInputChange}
            handleTipoPagoChange={handleTipoPagoChange}
            cambioEquivalente={cambioEquivalente}
        />
    );
}