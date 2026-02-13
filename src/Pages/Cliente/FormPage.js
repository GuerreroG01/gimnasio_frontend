import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../../Services/ClienteService';
import FormularioCliente from "../../Components/Cliente/FormularioCliente";
import ProgramaFitService from '../../Services/ProgramaFitService';
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export default function FormPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    let fechaActual = new Date();
    const fecha = new Date(fechaActual.getTime() - 6 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    const [cliente, setCliente] = useState({
        nombres: '',
        apellidos: '',
        telefono: '',
        correo : '',
        foto: null,
        fechaIngreso: fecha,
        activo: true,
        observaciones: '',
        nivelActual: '',
        genero: '',
    });
    const [fileName, setFileName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [exitocreacion, setexitocreacion] = useState('');
    const [mensaje_error, setmensaje_error] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mensajeAlerta, setMensajeAlerta] = useState('');
    const [niveles, setNiveles] = useState([]);

    useEffect(() => {
        if (id) {
        ClienteService.getClienteById(id)
            .then(response => {
            setCliente(response.data);
            if (response.data.foto) {
                const API_URL = (window._env_ ? window._env_.REACT_APP_IMAGE_URL : process.env.REACT_APP_IMAGE_URL)
                setImagePreview(`${API_URL}/${response.data.foto}`);
            }
            })
            .catch(error => {
            console.error('Error fetching user:', error);
            });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCliente(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCliente(prevState => ({
        ...prevState,
        foto: file
        }));
        setFileName(file ? file.name : '');
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        const clienteConDefaults = {
        ...cliente,
        telefono: cliente.telefono || "-",
        observaciones: cliente.observaciones || "Sin Observaciones"
        };
        if (!clienteConDefaults.nombres || !clienteConDefaults.apellidos || !clienteConDefaults.telefono || !clienteConDefaults.observaciones) {
        setMensajeAlerta('Por favor, completa todos los campos obligatorios.');
        return;
        }

        const formData = new FormData();
        formData.append('Nombres', clienteConDefaults.nombres);
        formData.append('Apellidos', clienteConDefaults.apellidos);
        formData.append('Telefono', clienteConDefaults.telefono);
        formData.append('Correo', clienteConDefaults.correo);
        if (clienteConDefaults.foto) {
            formData.append('Foto', clienteConDefaults.foto);
        }
        formData.append('FechaIngreso', clienteConDefaults.fechaIngreso);
        formData.append('Activo', clienteConDefaults.activo);
        formData.append('Observaciones', clienteConDefaults.observaciones);
        formData.append('Genero', clienteConDefaults.genero);
        setCargando(true);
        const start = Date.now();
        try {
        await ClienteService.createCliente(formData);
        const end = Date.now();
        const duration = end - start;

        if (duration < 500) {
            await new Promise(resolve => setTimeout(resolve, 500 - duration));
        }

        setexitocreacion('Cliente creado exitosamente');
        setTimeout(() => {
            setexitocreacion('');
            navigate(`/clientes`);
        }, 500);
        } catch (error) {
        console.error('Error creando cliente:', error);
        } finally {
        setCargando(false);
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        const clienteConDefaults = {
        ...cliente,
        telefono: cliente.telefono || "-",
        observaciones: cliente.observaciones || "Sin Observaciones"
        };

        if (!clienteConDefaults.nombres || !clienteConDefaults.apellidos || !clienteConDefaults.telefono || !clienteConDefaults.observaciones) {
        setMensajeAlerta('Por favor, completa todos los campos obligatorios.');
        return;
        }

        const formData = new FormData();
        formData.append('codigo', clienteConDefaults.codigo);
        formData.append('nombres', clienteConDefaults.nombres);
        formData.append('apellidos', clienteConDefaults.apellidos);
        formData.append('telefono', clienteConDefaults.telefono);
        formData.append('correo', clienteConDefaults.correo);
        formData.append('nivelActual', clienteConDefaults.nivelActual);
        if (clienteConDefaults.foto) {
        formData.append('foto', clienteConDefaults.foto);
        }
        formData.append('fechaIngreso', clienteConDefaults.fechaIngreso);
        formData.append('activo', clienteConDefaults.activo);
        formData.append('observaciones', clienteConDefaults.observaciones);
        formData.append('genero', clienteConDefaults.genero);

        setCargando(true);
        const start = Date.now();
        try {
            await ClienteService.updateCliente(clienteConDefaults.codigo, formData);
            const end = Date.now();
            const duration = end - start;

            if (duration < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - duration));
            }

            setexitocreacion('Cliente actualizado exitosamente');
            setTimeout(() => {
                setexitocreacion('');
                navigate(`/clientes`);
            }, 500);
        } catch (error) {
            console.error('Error actualizando cliente:', error);
            alert(`Error: ${error.response?.data?.title || 'Error al procesar la solicitud'}`);
        } finally {
            setCargando(false);
        }
    };

    const handleTelefonoChange = (e) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
        setmensaje_error('');
        handleChange(e);
        } else {
        setmensaje_error('Solo se aceptan dígitos en el teléfono');
        }
    };
    const formatDate = (date) => {
        if (!date) return 'No proporcionado';
        const zonedDate = toZonedTime(new Date(date), 'America/Managua');
        return format(zonedDate, 'dd MMMM yyyy', { locale: es });
    };
    useEffect(() => {
        const fetchNiveles = async () => {
        try {
            const data = await ProgramaFitService.getNiveles();
            setNiveles(data);
        } catch (error) {
            console.error('No se pudieron cargar los niveles:', error);
        }
        };
        fetchNiveles();
    }, []);
    const handleNivelChange = (e) => {
        setCliente({ ...cliente, nivelActual: e.target.value });
    };
    return(
        <FormularioCliente 
            id={id} cliente={cliente} setCliente={setCliente} fecha={fechaActual} formatDate={formatDate}
            fileName={fileName} imagePreview={imagePreview} exitocreacion={exitocreacion} mensaje_error={mensaje_error}
            mensajeAlerta={mensajeAlerta} setMensajeAlerta={setMensajeAlerta} cargando={cargando} handleChange={handleChange}
            handleFileChange={handleFileChange} handleSubmitCreate={handleSubmitCreate} handleSubmitUpdate={handleSubmitUpdate}
            handleTelefonoChange={handleTelefonoChange} navigate={navigate} niveles={niveles} handleNivelChange={handleNivelChange}
        />
    );
}