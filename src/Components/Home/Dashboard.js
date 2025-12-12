import React from "react";
import { Grid, Container, Box, Typography, Paper, Stack  } from "@mui/material";
import GananciasLineChart from "./GananciasLineChart";
import PagosAnualChart from "./PagosAnualChart";
import GananciasMensualesChart from "./GananciasMensualesChart";
import Reloj from "./Reloj";
import HomeIcon from '@mui/icons-material/Home';
import VencimientosProximos from './VencimientosProximos';
import DashboardResumen from './DashboardResumen';

const Dashboard = () => {
    console.log("Entraste en el home");
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
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Box
                        sx={{
                        position: "absolute",
                        top: { xs: "auto", sm: "auto", md: 180 },
                        right: { xs: "auto", sm: "auto", md: 90 },
                        left: { xs: 0, sm: 0, md: "auto" }, 
                        width: { xs: "100%", md: "auto" },
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-end" },
                        alignItems: "center",
                        zIndex: 10,
                        mt: { xs: 2, md: 0 },
                        }}
                    >
                        <Reloj />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} sx={{ mt: 27 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: { xs: 1, sm: 2 },
                            minHeight: { xs: 120, sm: 150 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            m: { xs: 0, sm: 2 }
                        }}
                    >
                        <PagosAnualChart />
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1, sm: 2 },
                        minHeight: { xs: 250, sm: 300 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "97%",
                        m: { xs: 0, sm: 2 }
                    }}
                >
                    <DashboardResumen sx={{width: "90%", height: "90%"}} />
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ ml: 1 }}>
                <VencimientosProximos />
            </Grid>
            <Grid item xs={12}>
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 1, sm: 2 },
                        minHeight: { xs: 250, sm: 300 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "97%",
                        m: { xs: 0, sm: 2 }
                    }}
                >
                    <GananciasMensualesChart sx={{width: "90%", height: "90%"}} />
                </Paper>
            </Grid>
        </Container>
    );
};
export default Dashboard;