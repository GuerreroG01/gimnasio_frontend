import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import VentaForm from "../../Components/Venta/VentaForm";
import ProductoService from '../../Services/ProductoService';
import VentaService from '../../Services/VentaService';
import TipoCambioService from '../../Services/TipoCambioService';

import { useExistencias } from '../../Context/ExistenciaContext';

import { convertirPrecio, obtenerSimboloMoneda, obtenerMonedaEquivalente } from '../../Utils/MonedaUtils';
export default function VentaFormPage() {
    const { codigo_venta } = useParams();
    const navigate = useNavigate();
    const authToken = localStorage.getItem("token");
    const ahora = new Date();
    const fechaLocal = ahora.toLocaleDateString('es-ES', {
        timeZone: 'America/Managua',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [fechaVenta, setFechaVenta] = useState(fechaLocal);

    const [monedaTotal, setMonedaTotal] = useState('NIO');

    const [efectivo, setEfectivo] = useState('');
    const [cambio, setCambio] = useState(0);

    const [tipoCambio, setTipoCambio] = useState(null);

    const [username, setUsername] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingFind, setLoadingFind] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 2;

    const { existencias } = useExistencias();

    useEffect(() => {
        if (authToken) {
            const decoded = jwtDecode(authToken);
            setUsername(decoded.sub);
        }
    }, [authToken]);

    useEffect(() => {
        setEditMode(!!codigo_venta);
    }, [codigo_venta]);

    useEffect(() => {
        if (!editMode || !codigo_venta) return;

        const fetchVenta = async () => {
            try {
                const venta = await VentaService.GetVentaById(codigo_venta);
                if (!venta) {
                    setError('No se encontró la venta.');
                    return;
                }
                setFechaVenta(
                    new Date(venta.fecha_venta).toLocaleDateString('es-ES', {
                        timeZone: 'America/Managua',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                );
                setMonedaTotal(venta.moneda);
                setEfectivo(venta.efectivo?.toString() ?? '');
                setCambio(venta.cambio ?? 0);

                setProductosSeleccionados(
                    venta.ventaProducto.map(vp => ({
                        producto: vp.producto,
                        cantidad: vp.cantidad
                    }))
                );
            } catch (err) {
                console.error(err);
                setError('Error al obtener la venta.');
            }
        };

        fetchVenta();
    }, [editMode, codigo_venta]);

    useEffect(() => {
        const fetchTipoCambio = async () => {
            try {
                const data = await TipoCambioService.getTipoCambios();
                setTipoCambio(data);
            } catch (error) {
                console.error('Error al cargar tipo de cambio', error);
            }
        };
        fetchTipoCambio();
    }, []);

    const totalNIO = productosSeleccionados.reduce((acc, { producto, cantidad }) =>
        acc + convertirPrecio(
            producto.precio * cantidad,
            producto.moneda,
            'NIO',
            tipoCambio
        ), 0
    );

    const totalUSD = productosSeleccionados.reduce((acc, { producto, cantidad }) =>
        acc + convertirPrecio(
            producto.precio * cantidad,
            producto.moneda,
            'USD',
            tipoCambio
        ), 0
    );

    const totalMostrado = monedaTotal === 'NIO' ? totalNIO : totalUSD;
    const simboloMoneda = obtenerSimboloMoneda(monedaTotal);

    useEffect(() => {
        const efectivoNum = parseFloat(efectivo);
        setCambio(
            !isNaN(efectivoNum)
                ? Math.max(efectivoNum - totalMostrado, 0)
                : 0
        );
    }, [efectivo, totalMostrado]);

    const monedaEquivalente = obtenerMonedaEquivalente(monedaTotal);
    const simboloCambioEquivalente = obtenerSimboloMoneda(monedaEquivalente);

    const totalEquivalente = monedaTotal === 'NIO' ? totalUSD : totalNIO;

    const cambioEquivalente = totalMostrado > 0
        ? (cambio * totalEquivalente) / totalMostrado
        : 0;

    const handleSelectProduct = (producto) => {
        if (!productosSeleccionados.find(p => p.producto.codigoProducto === producto.codigoProducto)) {
            setProductosSeleccionados([...productosSeleccionados, { producto, cantidad: 1 }]);
        }
    };

    const handleCantidadChange = (codigoProducto, cantidad) => {
        setProductosSeleccionados(prev =>
            prev.map(p =>
                p.producto.codigoProducto === codigoProducto
                    ? { ...p, cantidad }
                    : p
            )
        );
    };

    const handleCantidadChangeLocal = (codigoProducto, value, stock) => {
        const nuevaCantidad = parseInt(value, 10);
        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
        if (nuevaCantidad > stock) {
            setError('No hay suficientes existencias.');
            return;
        }
        handleCantidadChange(codigoProducto, nuevaCantidad);
    };

    const handleEliminarProducto = (codigoProducto) => {
        setProductosSeleccionados(prev =>
            prev.filter(p => p.producto.codigoProducto !== codigoProducto)
        );
    };

    const handleBuscarDescripcion = async (value) => {
        setDescripcion(value);
    };

    useEffect(() => {
        if (!descripcion.trim()) {
            setProductosFiltrados([]);
            return;
        }

        if (descripcion.length < 2) {
            setProductosFiltrados([]);
            setLoadingFind(false);
            return;
        }

        setLoadingFind(true);

        const delayDebounceFn = setTimeout(async () => {
            try {
                const productos = await ProductoService.getProductoByDescripcion(descripcion);
                setProductosFiltrados(productos.slice(0, 2));
            } catch (error) {
                console.error(error);
                setProductosFiltrados([]);
            } finally {
                setLoadingFind(false);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);

    }, [descripcion]);
    
    const mostrarFactura = async () => {
        setIsLoading(true);
        setMostrarPago(true);
        setIsLoading(false);
    };

    const handleGuardarVenta = async () => {
        if (!productosSeleccionados.length) {
            setError('Debe seleccionar al menos un producto.');
            return;
        }

        if (parseFloat(efectivo) < totalMostrado) {
            setError('El efectivo es insuficiente.');
            return;
        }

        const ventaData = {
            Nombre_vendedor: username,
            Moneda: monedaTotal,
            Total: Number(totalMostrado.toFixed(2)),
            Efectivo: Number(parseFloat(efectivo).toFixed(2)),
            Cambio: Number(cambio.toFixed(2)),
            Productos: productosSeleccionados.map(p => ({
                ProductoId: p.producto.codigoProducto,
                Cantidad: p.cantidad
            }))
        };

        try {
            editMode
                ? await VentaService.PutVenta(codigo_venta, ventaData)
                : await VentaService.PostVenta(ventaData);

            setOpenSnackbar(true);
            setMostrarPago(false);
            setTimeout(() => navigate('/venta'), 500);
        } catch (error) {
            console.error(error);
            setError('Error al guardar la venta.');
        }
    };

    useEffect(() => setPage(1), [productosSeleccionados.length]);

    const totalPages = Math.ceil(productosSeleccionados.length / itemsPerPage);
    const productosPaginados = productosSeleccionados.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <VentaForm
            productosSeleccionados={productosSeleccionados} productosFiltrados={productosFiltrados} descripcion={descripcion}
            fechaVenta={fechaVenta} existencias={existencias}

            monedaTotal={monedaTotal} setMonedaTotal={setMonedaTotal}

            totalMostrado={totalMostrado} simboloMoneda={simboloMoneda} totalEquivalente={totalEquivalente}
            simboloCambioEquivalente={simboloCambioEquivalente}

            efectivo={efectivo} setEfectivo={setEfectivo} cambio={cambio} cambioEquivalente={cambioEquivalente}

            page={page} setPage={setPage} totalPages={totalPages} itemsPerPage={itemsPerPage} productosPaginados={productosPaginados}

            editMode={editMode} mostrarPago={mostrarPago} isLoading={isLoading} loadingFind={loadingFind} openSnackbar={openSnackbar}

            handleSelectProduct={handleSelectProduct} handleCantidadChangeLocal={handleCantidadChangeLocal} onEliminarProducto={handleEliminarProducto}
            handleBuscarDescripcion={handleBuscarDescripcion} handleGuardarVenta={handleGuardarVenta} mostrarFactura={mostrarFactura}
            handleVolver={() => setMostrarPago(false)} setOpenSnackbar={setOpenSnackbar} setError={setError}
        />
    );
}