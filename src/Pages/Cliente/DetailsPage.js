import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../../Services/ClienteService';
import TiempoPagoService from '../../Services/TiempoPagoService';
import DetalleCliente from "../../Components/Cliente/DetalleCliente";
import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import defaultImage from '../../assets/Images/Desconocido.png';

export default function DetailsPage(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const clienteResponse = await ClienteService.getClienteById(id);
            const fechasResponse = await TiempoPagoService.getFechasByClienteId(id);
            const fechasOrdenadas = fechasResponse.data.sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));
            setCliente({ ...clienteResponse.data, TiempoPago: fechasOrdenadas });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (id) fetchData();
    }, [id]);
    const handleAddFecha = () => {
        const clienteId = cliente.codigo;
        navigate('/pagos/form', { state: { clienteId } });
    };

    const formatDate = (date) => {
        if (!date) return 'No proporcionado';
        const zonedDate = toZonedTime(new Date(date), 'America/Managua');
        return format(zonedDate, 'dd MMMM yyyy', { locale: es });
    };

    const formatMonthYear = (date) => {
        if (!date) return 'No disponible';
        return format(new Date(date), 'MMMM yyyy', { locale: es });
    };
    const calculateProgress = (fechaPago, fechaVencimiento) => {
        const now = new Date();
        const pagoDate = new Date(fechaPago);
        const vencimientoDate = new Date(fechaVencimiento);

        if (isNaN(pagoDate) || isNaN(vencimientoDate)) {
            return 0;
        }

        const totalTime = vencimientoDate - pagoDate;

        if (now >= vencimientoDate) {
            return 100;
        }

        const elapsedTime = now - pagoDate;

        return Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100));
    };

    const getColorBasedOnDate = (fechaPago, fechaVencimiento) => {
        const now = new Date();
        const vencimiento = new Date(fechaVencimiento);

        if (now >= vencimiento) {
            return 'rgba(255, 99, 71, 0.7)';
        } else {
            return 'rgba(144, 238, 144, 0.7)';
        }
    };

    if (!cliente) return <div>Loading...</div>;
    const API_IMAGES = (window._env_ ? window._env_.REACT_APP_IMAGE_URL : process.env.REACT_APP_IMAGE_URL);
    const imageUrl = cliente.foto ? `${API_IMAGES}/${cliente.foto}` : defaultImage;
    const telefonoMostrar = cliente.telefono.trim() === '-' ? 'No proporcionado' : cliente.telefono;
    const estadoCliente = cliente.estado ? 'Inactivo' : 'Activo';
    return(
        <DetalleCliente
            imageUrl={imageUrl}
            cliente={cliente}   id={id} navigate={navigate}
            telefonoMostrar={telefonoMostrar}
            estadoCliente={estadoCliente}
            formatDate={formatDate}
            handleAddFecha={handleAddFecha}
            formatMonthYear={formatMonthYear}
            calculateProgress={calculateProgress}
            getColorBasedOnDate={getColorBasedOnDate}
        />
    );
}