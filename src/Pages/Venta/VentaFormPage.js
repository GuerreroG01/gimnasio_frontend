import VentaForm from "../../Components/Venta/VentaForm";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ProductoService from '../../Services/ProductoService';
import VentaService from '../../Services/VentaService';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

export default function VentaFormPage(){
    const { codigo_venta } = useParams();
    const ahora = new Date();
    const fechaLocal = ahora.toLocaleDateString('es-ES', {
        timeZone: 'America/Managua',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('/').reverse().join('-');
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [total, setTotal] = useState(0);
    //eslint-disable-next-line
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState('');
    const [allProductos, setAllProductos] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();
    const [precioEspecial, setPrecioEspecial] = useState(null);
    const [fechaVenta, setFechaVenta] = useState(fechaLocal);
    const [ventaActual, setVentaActual] = useState(null);
    const [authToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(null);

    useEffect(() => {
        if (authToken) {
          const decodedToken = jwtDecode(authToken);
          setUsername(decodedToken.sub);
        }
      }, [authToken]);
    useEffect(() => {
        setEditMode(!!codigo_venta);
    }, [codigo_venta]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await ProductoService.getProductos();
                if (Array.isArray(response)) {
                    setAllProductos(response);
                    const firstLetter = Array.from(new Set(response.map((producto) => producto.descripcion[0].toUpperCase()))).sort()[0];
                    setSelectedLetter(firstLetter);
                } else {
                    setError('La respuesta de productos no es válida.');
                }
            } catch (error) {
                setError('Error al cargar los productos.');
            }
        };
        fetchProductos();
    }, []);

    useEffect(() => {
        if (editMode && codigo_venta) {
            const fetchVenta = async () => {
                try {
                    const venta = await VentaService.GetVentaById(codigo_venta);
            
                    if (venta) {
                        setVentaActual(venta);
    
                        setCantidad(venta.art_vendidos);
                        setTotal(venta.total);
                        setFechaVenta(venta.fecha_venta);
                        let producto = venta.producto;
                        if (!producto && venta.codigoProducto) {
                            producto = await ProductoService.getProductoById(venta.codigoProducto);
                        }
                        if (producto) {
                            setProductoSeleccionado(producto);
                            setSelectedLetter(producto.descripcion[0].toUpperCase());
                        } else {
                            setError('No se encontró el producto.');
                        }
                    } else {
                        setError('No se encontró la venta.');
                    }
                } catch (error) {
                    console.error('Error al obtener la venta:', error);
                    setError('Error al obtener los datos de la venta.');
                }
            };
    
            fetchVenta();
        }
    }, [codigo_venta, editMode]);         

    const filterProductsByLetter = useCallback((letter) => {
        if (letter) {
            const filtered = allProductos.filter(
                (producto) => producto.descripcion.toLowerCase().startsWith(letter.toLowerCase()) && producto.existencias >= 1
            );
            setProductos(filtered);
        }
    }, [allProductos]);

    useEffect(() => {
        if (allProductos.length > 0 && selectedLetter) {
            filterProductsByLetter(selectedLetter);
        }
    }, [selectedLetter, allProductos, filterProductsByLetter]);

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
    };

    const handleSelectProduct = (producto) => {
        setProductoSeleccionado(producto);
        setCantidad(1);
    
        if (editMode) {
            setTimeout(() => setTotal(producto.precio), 0);
        } else {
            setTotal(producto.precio);
        }
    };    
       

    const handleGuardarVenta = async () => {
        if (!productoSeleccionado) {
            setError('Debe seleccionar un producto.');
            return;
        }
        const precioFinal = precioEspecial !== null ? precioEspecial : total;
        const fechaFinal = editMode && fechaVenta ? fechaVenta : new Date().toISOString();
    
        const VentaData = {
            Codigo_venta: codigo_venta,
            Nombre_Vendedor: username,
            Total: precioFinal,
            Art_vendidos: cantidad,
            Fecha_venta: fechaFinal,
            CodigoProducto: productoSeleccionado.codigoProducto,
        };
    
        try {
            if (editMode) {
                if (!codigo_venta) {
                    console.error("Error: No se puede actualizar porque el ID es indefinido.");
                    setError("Error: ID de venta no encontrado.");
                    return;
                }
    
                console.log("🔍 Enviando PUT con ID:", codigo_venta, "Datos:", VentaData);
    
                await VentaService.PutVenta(codigo_venta, VentaData);
                setOpenSnackbar(true);
            } else {
                const response = await VentaService.PostVenta(VentaData);
                if (response) {
                    setOpenSnackbar(true);
                    const updatedExistencias = productoSeleccionado.existencias - cantidad;
    
                    if (updatedExistencias < 0) {
                        setError('No hay suficientes existencias del producto.');
                        return;
                    }
    
                    await ProductoService.updateProducto(productoSeleccionado.codigoProducto, {
                        ...productoSeleccionado,
                        existencias: updatedExistencias,
                    });
                }
            }
            setTimeout(() => navigate('/venta'), 500);
        } catch (error) {
            console.error("Error al registrar/actualizar la venta:", error);
            setError("Error al registrar/actualizar la venta.");
        }
    };
    return(
        <VentaForm
            productoSeleccionado={productoSeleccionado}
            editMode={editMode}
            allProductos={allProductos}
            handleLetterClick={handleLetterClick}
            selectedLetter={selectedLetter}
            productos={productos}
            handleSelectProduct={handleSelectProduct}
            cantidad={cantidad}
            setCantidad={setCantidad}
            total={total}
            setTotal={setTotal}
            setError={setError}
            handleGuardarVenta={handleGuardarVenta}
            ventaActual={ventaActual}
            setPrecioEspecial={setPrecioEspecial}
            openSnackbar={openSnackbar}
            setOpenSnackbar={setOpenSnackbar}
        />
    );
}