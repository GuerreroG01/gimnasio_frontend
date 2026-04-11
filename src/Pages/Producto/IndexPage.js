import React, { useEffect, useState, useCallback  } from 'react';
import productoService from '../../Services/ProductoService';
import IndexProducto from "../../Components/Producto/IndexProducto";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import SpaIcon from '@mui/icons-material/Spa';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import BackpackIcon from '@mui/icons-material/Backpack';

export default function IndexPage() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [currentProducto, setCurrentProducto] = useState({
        codigoProducto: 0,
        descripcion: '',
        precio: 0,
        existencias: 0,
        categoria: '',
        moneda: '',
        stockMinimo: 0,
    });
    const emptyProducto = { ...currentProducto };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    const fetchCategorias = useCallback(async () => {
        try {
            const data = await productoService.getCategorias();
            setCategorias([...data]);

            if (data.length > 0) {
                const primeraCategoria = data[0];
                setCategoriaSeleccionada(primeraCategoria);

                const productosIniciales =
                    await productoService.getProductosByCategoria(primeraCategoria);

                setProductos(productosIniciales);
            }
        } catch (error) {
            const backendMessage =
                error?.response?.data || 'Error al obtener categorías.';

            showSnackbar(backendMessage, 'error');
        }
    }, [])
    
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);

    useEffect(() => {
        if (!categoriaSeleccionada) return;

        const fetchProductos = async () => {
            try {
                const data = await productoService.getProductosByCategoria(categoriaSeleccionada);
                setProductos(data);
            } catch (error) {
                console.error('Error al obtener productos por categoría:', error);
            }
        };

        fetchProductos();
    }, [categoriaSeleccionada]);

    const handleCategoriaChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
    };

    const handleOpenEdit = async (event, producto) => {
        setCurrentProducto({
            ...producto
        });

        setAnchorEl(event.currentTarget);
    };

    const handleOpenNew = async (event) => {

        setCurrentProducto({
            codigoProducto: 0,
            descripcion: '',
            precio: 0,
            existencias: 0,
            categoria: '',
            moneda:'',
            stockMinimo: 0,
        });

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        document.activeElement?.blur();
    };

    const handleChange = (e) => {
        setCurrentProducto({ ...currentProducto, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!currentProducto.descripcion || currentProducto.precio <= 0 || currentProducto.existencias < 0) {
            setError('Por favor, completa todos los campos obligatorios.');
            setLoading(false);
            return;
        }

        try {
            let categoriaFinal = currentProducto.categoria;

            if (currentProducto.codigoProducto === 0) {
                await productoService.createProducto(currentProducto);
                showSnackbar('Producto creado exitosamente.');
            } else {
                await productoService.updateProducto(currentProducto.codigoProducto, currentProducto);
                showSnackbar('Producto actualizado exitosamente.');
            }

            const existeCategoria = categorias.includes(categoriaFinal);

            if (!existeCategoria) {
                await fetchCategorias();
            }

            setCategoriaSeleccionada(categoriaFinal);

        } catch (error) {
            console.error('Error al guardar el producto:', error);
            showSnackbar(currentProducto.codigoProducto === 0 ? 'Error al crear el producto.' : 'Error al actualizar el producto.');
        } finally {
            setLoading(false);
            setCurrentProducto({
                codigoProducto: 0,
                descripcion: '',
                precio: 0,
                existencias: 0,
                categoria: '',
                moneda: '',
                stockMinimo: 0,
            });
            handleClose();
            setTimeout(() => setSuccess(''), 2000);
        }
    };

    const handleDelete = (id) => {
        setDeleteProductId(id);
        setOpenDeleteDialog(true);
        setDeleteSuccess('');
        setDeleteError('');
    };

    const confirmDelete = async () => {
        try {
            await productoService.deleteProducto(deleteProductId);
            showSnackbar('Producto eliminado exitosamente.');
            setAnchorEl(null);
            setCurrentProducto(emptyProducto);
            const productosActuales = await productoService.getProductosByCategoria(categoriaSeleccionada);
            setProductos(productosActuales);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            showSnackbar('Error al eliminar el producto.');
        } finally {
            setOpenDeleteDialog(false);
            setTimeout(() => {
                setDeleteSuccess('');
                setDeleteError('');
            }, 3000);
        }
    };


    const getCategoryIcon = (categoria) => {
        switch (categoria) {
            case 'Suplementos': return <LocalDrinkIcon sx={{ fontSize: 80, color: '#3f51b5' }} />;
            case 'Equipos de Entrenamiento': return <FitnessCenterIcon sx={{ fontSize: 80, color: '#f57c00' }} />;
            case 'Accesorios Deportivos': return <BackpackIcon sx={{ fontSize: 80, color: '#9c27b0' }} />;
            case 'Bebidas y Alimentos': return <LocalDrinkIcon sx={{ fontSize: 80, color: '#4caf50' }} />;
            case 'Recuperación y Cuidado Personal': return <SpaIcon sx={{ fontSize: 80, color: '#009688' }} />;
            case 'Clases y Servicios': return <GroupIcon sx={{ fontSize: 80, color: '#ff9800' }} />;
            default: return <CategoryIcon sx={{ fontSize: 80, color: '#607d8b' }} />;
        }
    };

    return (
        <IndexProducto
            productos={productos}
            setProductos={setProductos}
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            handleCategoriaChange={handleCategoriaChange}
            anchorEl={anchorEl}
            handleOpenNew={handleOpenNew} handleOpenEdit={handleOpenEdit}
            handleClose={handleClose}
            loading={loading}
            success={success}
            error={error}
            currentProducto={currentProducto}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            openDeleteDialog={openDeleteDialog}
            setOpenDeleteDialog={setOpenDeleteDialog}
            confirmDelete={confirmDelete}
            handleDelete={handleDelete}
            deleteSuccess={deleteSuccess}
            deleteError={deleteError}
            getCategoryIcon={getCategoryIcon}
            snackbar={snackbar}
            handleCloseSnackbar={handleCloseSnackbar}
        />
    );
}