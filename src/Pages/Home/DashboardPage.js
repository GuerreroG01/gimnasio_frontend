import React, { useEffect, useState } from 'react';
import Dashboard from '../../Components/Home/Dashboard';
import PagoService from '../../Services/PagoService';
import { CircularProgress, Box, Snackbar, Alert } from "@mui/material";

export default function DashboardPage() {
    const [pagosData, setPagosData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await PagoService.getAñosConPagos();
                setPagosData(response);
            } catch (err) {
                const mensaje = err.response?.data?.message;
                console.error("Error al obtener los pagos:", mensaje || err.message);

                if (mensaje === "No se encontraron pagos registrados.") {
                    setPagosData([]);
                } else {
                    setError(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Snackbar open={true} autoHideDuration={3000}>
                <Alert severity="error">Error al cargar los datos del dashboard.</Alert>
            </Snackbar>
        );
    }

    return <Dashboard pagosData={pagosData} />;
}