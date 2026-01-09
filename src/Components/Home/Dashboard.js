import { 
    Grid, Container, Box, Typography, Paper, Stack
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';

import GananciasLineChart from "./GananciasLineChart";
//import PagosAnualChart from "./PagosAnualChart";
//import GananciasMensualesChart from "./GananciasMensualesChart";
import Reloj from "./Reloj";
//import VencimientosProximos from './VencimientosProximos';
//import DashboardResumen from './DashboardResumen';
import TipoPagoList from "../TipoPago/TipoPagoList";
import TipoCambioList from "../TipoCambio/TipoCambioList";

const Dashboard = () => {
    return (
        <Container maxWidth="xl">
            <Box mt={4} mb={2} textAlign="left">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <HomeIcon color="primary" fontSize="large" />
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        Inicio
                    </Typography>
                </Stack>
            </Box>

            <Grid container spacing={4}>
                {/* Gráfico principal */}
                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ display: { xs: "flex", sm: "block" }}}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: { xs: 1, sm: 2 }, 
                            minHeight: { xs: 250, sm: 300 }, 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            width: "100%", 
                            m: { xs: 0, sm: 1 } 
                        }}
                    >
                        <GananciasLineChart />
                    </Paper>
                </Grid>

                {/* Panel derecho con Reloj, TipoPagoList y TipoCambioList */}
                <Grid item xs={12} sm={5} md={4} lg={4} container justifyContent="flex-end" sx={{ pl: { sm: 2, md: 4 } }}>
                    <Stack spacing={2} sx={{ alignItems: { xs: "center", md: "flex-end" }, ml: "auto" }}>
                        {/* Reloj */}
                        <Box sx={{ position: "relative", left: 10 }}>
                            <Reloj />
                        </Box>

                        {/* Lista de Tipos de Pago */}
                        <Paper elevation={3} sx={{ p: 2, maxHeight: 400, width: { xs: "100%", md: 350 }, overflow: "auto" }}>
                            <TipoPagoList />
                        </Paper>

                        {/* Lista de Tipos de Cambio */}
                        <Paper elevation={3} sx={{ p: 2, maxHeight: 200, width: { xs: "100%", md: 350 }, overflow: "auto" }}>
                            <TipoCambioList />
                        </Paper>
                    </Stack>
                </Grid>

                {/*<Grid item xs={12} sm={6} md={6} lg={6} sx={{ mt: 27 }}>
                    <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, minHeight: { xs: 120, sm: 150 }, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", m: { xs: 0, sm: 2 } }}>
                        <PagosAnualChart />
                    </Paper>
                </Grid>*/}
            </Grid>

            {/*<Grid item xs={12}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, minHeight: { xs: 250, sm: 300 }, display: "flex", alignItems: "center", justifyContent: "center", width: "97%", m: { xs: 0, sm: 2 } }}>
                    <DashboardResumen sx={{ width: "90%", height: "90%" }} />
                </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ ml: 1 }}>
                <VencimientosProximos />
            </Grid>

            <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, minHeight: { xs: 250, sm: 300 }, display: "flex", alignItems: "center", justifyContent: "center", width: "97%", m: { xs: 0, sm: 2 } }}>
                    <GananciasMensualesChart sx={{ width: "90%", height: "90%" }} />
                </Paper>
            </Grid>*/}
        </Container>
    );
};
export default Dashboard;