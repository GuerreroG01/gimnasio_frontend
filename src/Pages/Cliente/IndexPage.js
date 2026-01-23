import React, { useEffect, useCallback } from 'react';
import ClienteService from '../../Services/ClienteService';
import Index from "../../Components/Cliente/Index";
import { useNavigate } from 'react-router-dom';
export default function IndexPage(){
    const [Clientes, setClientes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [loadingFilter, setLoadingFilter] = React.useState(false);
    const [alerta, setAlerta] = React.useState({ mensaje: '', tipo: '' });
    const [modalOpen, setModalOpen] = React.useState(false);
    const [clienteAEliminar, setClienteAEliminar] = React.useState(null);
    const [nombreCliente, setNombreCliente] = React.useState('');
    const [apellidoCliente, setApellidoCliente] = React.useState('');
    const [clienteFiltrados, setClienteFiltrados] = React.useState([]);
    const [page, setPage] = React.useState(0);
    //eslint-disable-next-line
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [paginationRange, setPaginationRange] = React.useState({ start: 0, end: 5 });
    const [letrasDisponibles, setLetrasDisponibles] = React.useState([]);
    const [letraSeleccionada, setLetraSeleccionada] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);
    const navigate = useNavigate();
    const [showLetras, setShowLetras] = React.useState(true);
    const fetchLetrasDisponibles = async () => {
        try {
          const response = await ClienteService.getClientePorPrimeraLetra();
          setLetrasDisponibles(response.data);
          if (response.data && response.data.length > 0) {
            setLetraSeleccionada(response.data[0].primeraLetra);
          }
        } catch (error) {
          console.error('Error fetching letters:', error);
        }
    };
    const fetchClientePorLetra = async (letra) => {
        try {
          setLoading(true);
          const response = await ClienteService.getClientePorLetra(letra);
          const clienteData = Array.isArray(response) ? response : [];
          setClientes(clienteData);
          setClienteFiltrados(clienteData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching users by letter:', error);
          setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchLetrasDisponibles();
    }, []);
      
    const handleFilterChange = useCallback(async () => {
        let filtered = [];
        setLoadingFilter(true);
    
        if (nombreCliente || apellidoCliente) {
            try {
                const response = await ClienteService.buscarCliente(nombreCliente, apellidoCliente);
                filtered = response.data;
            } catch (error) {
                console.error('Error al realizar la búsqueda:', error);
                return;
            }
        } else {
          filtered = Clientes;
        }
        setClienteFiltrados(filtered);
        setTimeout(() => {
            setLoadingFilter(false);
        }, 100);
    }, [nombreCliente, apellidoCliente, Clientes]);
      
    useEffect(() => {
        if (letraSeleccionada && !showFilters) {
          fetchClientePorLetra(letraSeleccionada);
          setPage(0);
        }
    }, [letraSeleccionada, showFilters]);
    
    useEffect(() => {
        if (showFilters) {
          handleFilterChange();
        }
    }, [showFilters, nombreCliente, apellidoCliente, handleFilterChange]);
    
    const handleEdit = (id) => {
        navigate(`/clientes/${id}/update`);
    };
    
    const handleDeleteOpen = (cliente) => {
        setClienteAEliminar(cliente);
        setModalOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        if (clienteAEliminar) {
            try {
                await ClienteService.deleteCliente(clienteAEliminar.codigo);
                fetchClientePorLetra(letraSeleccionada);
                setAlerta({ mensaje: 'Cliente eliminado exitosamente', tipo: 'success' });
                setTimeout(() => setAlerta({ mensaje: '', tipo: '' }), 2000);
            } catch (error) {
                console.error('Error deleting user:', error);
                setAlerta({ mensaje: 'Error al eliminar cliente', tipo: 'error' });
                setTimeout(() => setAlerta({ mensaje: '', tipo: '' }), 2000);
            }
        }
        setModalOpen(false);
        setClienteAEliminar(null);
      };
    
    const handleViewDetails = (id) => {
        navigate(`/clientes/${id}/details`);
    };
    
    const handleCreateNew = () => {
        navigate('/clientes/form');
    };
    
    const updatePaginationRange = (newPage) => {
        const totalPages = Math.ceil(clienteFiltrados.length / rowsPerPage);
        const start = Math.floor(newPage / 4) * 4;
        const end = Math.min(start + 4, totalPages);
        setPaginationRange({ start, end });
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
        updatePaginationRange(newPage - 1);
    };
            
    const mostrarPaginacion = clienteFiltrados.length === Clientes.length;

    const paginationButtons = [];
        for (let i = paginationRange.start; i < paginationRange.end; i++) {
            if (i < Math.ceil(clienteFiltrados.length / rowsPerPage)) {
                paginationButtons.push(i + 1);
            }
        }
    useEffect(() => {
        if (showFilters) {
            setShowLetras(false);
        } else {
            const timer = setTimeout(() => setShowLetras(true), 500);
            return () => clearTimeout(timer);
        }
    }, [showFilters]);

    return(
        <Index
            alerta={alerta} setAlerta={setAlerta}
            nombreCliente={nombreCliente}   setNombreCliente={setNombreCliente}
            apellidoCliente={apellidoCliente}   setApellidoCliente={setApellidoCliente}
            showFilters={showFilters}    setShowFilters={setShowFilters}
            letrasDisponibles={letrasDisponibles}
            letraSeleccionada={letraSeleccionada}   setLetraSeleccionada={setLetraSeleccionada}
            loadingFilter={loadingFilter}    setLoadingFilter={setLoadingFilter}
            handleCreateNew={handleCreateNew}
            clienteFiltrados={clienteFiltrados}
            loading={loading}
            page={page} rowsPerPage={rowsPerPage}
            handleEdit={handleEdit} handleDeleteOpen={handleDeleteOpen}
            handleDeleteConfirm={handleDeleteConfirm}  handleViewDetails={handleViewDetails}
            mostrarPaginacion={mostrarPaginacion}   handleChangePage={handleChangePage}
            modalOpen={modalOpen}    setModalOpen={setModalOpen}
            showLetras={showLetras}
        />
    );
}