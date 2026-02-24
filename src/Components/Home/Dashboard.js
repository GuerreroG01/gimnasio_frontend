import {
    Grid, Container, Box, Typography, Paper, Stack,
    useTheme
} from "@mui/material";
import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import DashboardResumen from "./DashboardResumen";
import TipoPagoList from "../TipoPago/TipoPagoList";
import TipoCambioList from "../TipoCambio/TipoCambioList";
import RutinasList from "../ProgramaFit/RutinasFit/RutinasList";
import Reloj from "./Reloj";
import GananciasTable from "./GananciasTable";
import PagosAnualTable from "./PagosAnualTable";
import GananciasMensualesChart from "./GananciasMensualesChart";
import VencimientosProximos from "./VencimientosProximos";

const Dashboard = ({ pagosData = [] }) => {
    const theme = useTheme();
    const [openRutinas, setOpenRutinas] = React.useState(false);
    const [openTipoPago, setOpenTipoPago] = React.useState(false);
    
    const actions = [
        {
            title: "Tipos de Pago",
            description: "Gestiona planes de membresía y pagos",
            icon: <PaymentsOutlinedIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
            onClick: () => setOpenTipoPago(true),
        },
        {
            title: "Rutinas",
            description: "Administra ejercicios y rutinas de entrenamiento",
            icon: <FitnessCenterIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
            onClick: () => setOpenRutinas(true),
        }
    ];

    return (
        <Container
            maxWidth={false}
            sx={{
                bgcolor: theme.palette.background.paper,
                minHeight: "100vh",
                py: 3
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <HomeIcon color="primary" fontSize="large" />
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Inicio
                </Typography>
            </Stack>

            <Box mb={4}>
                <DashboardResumen sx={{ width: "100%" }} />
            </Box>
            <Grid container spacing={2}>
                <Box
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    gap={2}
                >
                    <Box
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        justifyContent={{ xs: "center", md: "space-between" }}
                        alignItems="flex-start"
                        width="100%"
                        mb={2}
                        gap={{ xs: 2, md: 2 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                            }}
                        >
                            <Box
                                sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 3,
                                alignItems: "flex-start",
                                }}
                            >
                                <Box flex={1}>
                                    <GananciasTable pagosData={pagosData} />
                                </Box>

                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 3,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                        },
                                        minWidth: { md: 250 },
                                    }}
                                >
                                    <TipoCambioList />
                                </Paper>
                            </Box>

                            <Paper
                                elevation={4}
                                sx={{
                                p: 3,
                                borderRadius: 3,
                                width: "100%",
                                maxWidth: {
                                    xs: 400,
                                    md: 800,
                                },
                                mx: "auto",
                                overflow: "auto",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                },
                                }}
                            >
                                <GananciasMensualesChart pagosData={pagosData} />
                            </Paper>
                        </Box>
                        <Box
                            sx={{ ml: { xs: 0, md: 2 }, mr: { xs: 0, md: 4 } }}
                            display="flex"
                            flexDirection="column"
                            alignItems={{ xs: "center", md: "flex-end" }}
                            gap={2}
                        >
                            <Box mb={2}>
                                <Reloj />
                            </Box>
                            
                            <Paper
                                elevation={4}
                                onClick={actions[1].onClick}
                                sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 3,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                },
                                }}
                            >
                                {actions[1].icon}
                                <Typography variant="h6" mt={2} textAlign="center">
                                {actions[1].title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
                                {actions[1].description}
                                </Typography>
                            </Paper>
                            <Paper
                                elevation={4}
                                onClick={actions[0].onClick}
                                sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 3,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                },
                                }}
                            >
                                {actions[0].icon}
                                <Typography variant="h6" mt={2} textAlign="center">
                                {actions[0].title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
                                {actions[0].description}
                                </Typography>
                            </Paper>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <PagosAnualTable pagosData={pagosData} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>

                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {actions.slice(2).map((action, index) => (
                            <Grid item xs={12} md={6} key={index}>
                            <Paper
                                elevation={4}
                                onClick={action.onClick}
                                sx={{
                                p: 3,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 3,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                                },
                                }}
                            >
                                {action.icon}
                                <Typography variant="h6" mt={2} textAlign="center">
                                {action.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mt={1} textAlign="center">
                                {action.description}
                                </Typography>
                            </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <VencimientosProximos />
            </Grid>
            <TipoPagoList open={openTipoPago} onClose={() => setOpenTipoPago(false)} />
            <RutinasList open={openRutinas} onClose={() => setOpenRutinas(false)} />
        </Container>
    );
};

export default Dashboard;