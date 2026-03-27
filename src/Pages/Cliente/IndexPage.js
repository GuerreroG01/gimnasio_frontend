import React, { useEffect, useCallback } from 'react';
import ClienteService from '../../Services/ClienteService';
import Index from "../../Components/Cliente/Index";
import { useNavigate } from 'react-router-dom';
export default function IndexPage(){
    const [loading, setLoading] = React.useState(true);
    const [alerta, setAlerta] = React.useState({ mensaje: '', tipo: '' });

    const [modalOpen, setModalOpen] = React.useState(false);
    const [clienteAEliminar, setClienteAEliminar] = React.useState(null);

    const [nombreCliente, setNombreCliente] = React.useState('');
    const [apellidoCliente, setApellidoCliente] = React.useState('');
    const [clienteFiltrados, setClienteFiltrados] = React.useState([]);

    const [page, setPage] = React.useState(1);
    const [rowsPerPage] = React.useState(10);
    const [totalPaginas, setTotalPaginas] = React.useState(0);

    const [ordenarPor, setOrdenarPor] = React.useState(null);
    const [orden, setOrden] = React.useState("asc");
    const [showFilters, setShowFilters] = React.useState(false);

    const navigate = useNavigate();

    const fetchClientes = useCallback(async () => {
        try {
            setLoading(true);

            let response;

            if (nombreCliente || apellidoCliente) {
                response = await ClienteService.buscarCliente(
                    nombreCliente,
                    apellidoCliente,
                    page,
                    rowsPerPage
                );

                setClienteFiltrados(response.data.clientes);
            } else {
                response = await ClienteService.getClientes(
                    page,
                    ordenarPor,
                    orden
                );

                setClienteFiltrados(response.clientes);
            }

            if (nombreCliente || apellidoCliente) {
                setClienteFiltrados(response.data.clientes);
                setTotalPaginas(response.data.totalPaginas);
            } else {
                setClienteFiltrados(response.clientes);
                setTotalPaginas(response.totalPaginas);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, ordenarPor, orden, nombreCliente, apellidoCliente]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    useEffect(() => {
        setPage(1);
    }, [nombreCliente, apellidoCliente]);

    const handleDeleteConfirm = async () => {
        if (clienteAEliminar) {
            try {
                await ClienteService.deleteCliente(clienteAEliminar.codigo);

                if (clienteFiltrados.length === 1 && page > 1) {
                    setPage(prev => prev - 1);
                } else {
                    fetchClientes();
                }

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

    const handleEdit = (id) => {
        navigate(`/clientes/${id}/update`);
    };

    const handleDeleteOpen = (cliente) => {
        setClienteAEliminar(cliente);
        setModalOpen(true);
    };

    const handleViewDetails = (id) => {
        navigate(`/clientes/${id}/details`);
    };

    const handleCreateNew = () => {
        navigate('/clientes/form');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSort = (campo) => {
        let direccion = 'asc';

        if (ordenarPor === campo && orden === 'asc') {
            direccion = 'desc';
        }

        setOrdenarPor(campo);
        setOrden(direccion);
        setPage(1);
    };
    const resetFiltrado = () => {
        setNombreCliente('');
        setApellidoCliente('');

        setOrdenarPor(null);
        setOrden('asc');
        setPage(1);

        setLoading(true);
        fetchClientes().finally(() => setLoading(false));
    };

    return(
        <Index
            alerta={alerta} setAlerta={setAlerta}
            nombreCliente={nombreCliente} setNombreCliente={setNombreCliente}
            apellidoCliente={apellidoCliente} setApellidoCliente={setApellidoCliente}
            showFilters={showFilters}    setShowFilters={setShowFilters}

            handleCreateNew={handleCreateNew}
            clienteFiltrados={clienteFiltrados}
            loading={loading}

            page={page}
            rowsPerPage={rowsPerPage}
            totalPaginas={totalPaginas}

            handleEdit={handleEdit}
            handleDeleteOpen={handleDeleteOpen}
            handleDeleteConfirm={handleDeleteConfirm}
            handleViewDetails={handleViewDetails}

            handleChangePage={handleChangePage}

            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            ordenarPor={ordenarPor}
            setOrdenarPor={setOrdenarPor}
            orden={orden}
            setOrden={setOrden}
            handleSort={handleSort}
            resetFiltrado={resetFiltrado}
        />
    );
}