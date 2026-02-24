import React, { useEffect, useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import pagosService from '../../Services/PagoService';
import PagoForm from '../../Components/Pago/PagoForm';
import ClienteService from '../../Services/ClienteService';
import TiposPagoService from '../../Services/Tipo_PagosService';
import TipoCambioService from '../../Services/TipoCambioService';
import { convertirPrecio, obtenerMonedaEquivalente } from '../../Utils/MonedaUtils';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSnackbar from '../../Shared/Components/CustomSnackbar';

export default function FormPage({ pagoId, onSuccess }) {
    const location = useLocation();
    const { clienteId } = location.state || {};
    const monedas = [
        { value: 'NIO', label: 'NIO' },
        { value: 'USD', label: 'USD' },
    ];
    const [clientes, setClientes] = React.useState([]);
    const [loadingClientes, setLoadingClientes] = React.useState(false);
    const [tiposPago, setTiposPago] = React.useState([]);
    const [loadingTiposPago, setLoadingTiposPago] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    let fechaActual = new Date();
    const [initialValues, setInitialValues] = React.useState({
        CodigoCliente: clienteId || '',
        MesesPagados: 1,
        FechaPago: fechaActual,
        Moneda: 'NIO',
        Efectivo: 0,
        Cambio: 0,
        Monto: 0,
        DetallePago: '',
        IntervaloPago: false,
        CodigoTipoPago:'',
        TipoPago: null,
    });
    const [montoBase, setMontoBase]= React.useState(0);
    const [monedaBase, setMonedaBase] = React.useState('NIO');
    const [tipoCambio, setTipoCambio] = React.useState([]); 
    const [cambioEquivalente, setCambioEquivalente] = React.useState(0);
    const navigate= useNavigate();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'warning'
    });

    const showSnackbar = (message, severity = 'warning') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

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
                    IntervaloPago: values.IntervaloPago ? 1 : 0,
                    CodigoTipoPago: values.CodigoTipoPago
                };

                const pagoGuardado = pagoId
                    ? await pagosService.updatePago(pagoId, datosPago)
                    : await pagosService.createPago(datosPago);
                    console.log('Datos del pago:', datosPago);

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
    const { values, setFieldValue } = formik;

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
        if (!montoBase || !monedaBase) return;

        const montoConvertido = convertirPrecio(
            montoBase,
            monedaBase,
            values.Moneda,
            tipoCambio
        );

        setFieldValue("Monto", montoConvertido);
    }, [values.Moneda, tipoCambio, montoBase, monedaBase, setFieldValue]);

    useEffect(() => {
        const efectivo = parseFloat(values.Efectivo) || 0;
        const monto = parseFloat(values.Monto) || 0;
        const cambio = Math.max(0, efectivo - monto);

        if (values.Cambio !== cambio) {
            setFieldValue("Cambio", cambio);
        }

        const monedaDestino = obtenerMonedaEquivalente(values.Moneda);
        const cambioEq = convertirPrecio(cambio, values.Moneda, monedaDestino, tipoCambio);
        if (cambioEq !== cambioEquivalente) {
            setCambioEquivalente(cambioEq);
        }
    }, [values.Efectivo, values.Monto, values.Moneda, values.Cambio, tipoCambio, cambioEquivalente, setFieldValue]);

    const limpiarTipoPago = useCallback(() => {
        setFieldValue("TipoPago", null);
        setFieldValue("CodigoTipoPago", "");
        setMontoBase(0);
        setMonedaBase("NIO");
    }, [setFieldValue]);

    const handleTipoPagoInputChange = (event, value, reason) => {
        if (reason !== 'input') return;
        if (tipoPagoSearchTimeout.current) clearTimeout(tipoPagoSearchTimeout.current);
        setLoadingTiposPago(true);
        tipoPagoSearchTimeout.current = setTimeout(() => {
        handleBuscarTipoPagoDebounced(value);
        }, autocompleteDelay);
    };
    const handleTipoPagoChange = useCallback((event, value) => {
        if (!value) {
            setFieldValue("TipoPago", null);
            setFieldValue("CodigoTipoPago", "");
            return;
        }

        setFieldValue("CodigoTipoPago", value.codigoPago);
        setMontoBase(value.monto);
        setMonedaBase(value.moneda);

        const montoConvertido = convertirPrecio(
            value.monto,
            value.moneda,
            values.Moneda,
            tipoCambio
        );

        setFieldValue("MesesPagados", value.duracion);
        setFieldValue("Monto", montoConvertido);
        setFieldValue(
            "IntervaloPago",
            value.unidadTiempo.toLowerCase() !== "dias"
        );

    }, [setFieldValue, values.Moneda, tipoCambio]);

    const cargarUltimoPago = useCallback(async (codigoCliente) => {
        try {
            const ultimoPago = await pagosService.getUltimoPagoPorCliente(codigoCliente);

            if (!ultimoPago?.codigoTipoPago) return;

            const response = await TiposPagoService.getTipoPagoById(
                ultimoPago.codigoTipoPago
            );

            const tipoValido = response.data;

            if (!tipoValido) {
                limpiarTipoPago();
                showSnackbar(
                    "El tipo de pago del último registro fue eliminado.",
                    "warning"
                );
                return;
            }

            setTiposPago([tipoValido]);
            handleTipoPagoChange(null, tipoValido);

        } catch (err) {

            if (err.response?.status === 404) {
                limpiarTipoPago();
                showSnackbar("Nuevo cliente", "success");
                return;
            }

            console.error('Error real cargando último pago:', err);
            showSnackbar(
                "Ocurrió un error al consultar el último pago.",
                "error"
            );
        }

    }, [handleTipoPagoChange, limpiarTipoPago]);
    
    useEffect(() => {
        if (clienteId) {
            ClienteService.getClienteById(clienteId)
                .then((res) => {
                    const clienteData = res.data;
                    setClientes([clienteData]);
                    setFieldValue('CodigoCliente', clienteData.codigo);
                    cargarUltimoPago(clienteData.codigo);
                })
                .catch(err => console.error(err));
        }
    }, [clienteId, setFieldValue, cargarUltimoPago]);

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

    return (
        <>
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
                cargarUltimoPago={cargarUltimoPago}
            />
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
}