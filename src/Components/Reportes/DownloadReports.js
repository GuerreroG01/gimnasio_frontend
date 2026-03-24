import React from "react";
import { Box, Button, Typography, CircularProgress, Grid, Card, CardContent, CardActions, useTheme, Popover, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import ReportService from "../../Services/ReportService";
import InfoIcon from "@mui/icons-material/Info";

const reports = [
    {
        id: "financiero",
        title: "Reporte de Ingresos",
        description: "Comparación detallada de los ingresos, pagos y ventas entre el mes actual y el mes anterior, incluyendo el porcentaje de cambio en los ingresos.",
        serviceCall: ReportService.downloadReporteFinanciero,
        icon: <MonetizationOnIcon sx={{ fontSize: 50, color: "#4caf50" }} />,
        gradientLight: "linear-gradient(145deg, #e8f5e9, #c8e6c9)",
        gradientDark: "linear-gradient(145deg, #d0f0c0, #a8d5a0)",
    },
    {
        id: "mejores",
        title: "Mejores Entradas",
        description: "Ingresos del mes actual y los top productos y membresías más vendidos.",
        serviceCall: ReportService.downloadReporteMejores,
        icon: <StarIcon sx={{ fontSize: 50, color: "#ffb300" }} />,
        gradientLight: "linear-gradient(145deg, #fff8e1, #ffe082)",
        gradientDark: "linear-gradient(145deg, #ffefb0, #ffd54f)",
    },
    {
        id: "nuevos",
        title: "Clientes Nuevos",
        description: "Información de los clientes que se unieron durante el mes actual.",
        serviceCall: ReportService.downloadReporteNuevos,
        icon: <PersonAddIcon sx={{ fontSize: 50, color: "#2196f3" }} />,
        gradientLight: "linear-gradient(145deg, #e3f2fd, #90caf9)",
        gradientDark: "linear-gradient(145deg, #c2e0fa, #64b5f6)",
    },
    {
        id: "asistencia",
        title: "Reporte Asistencias",
        description: "Resumen de asistencia mensual: picos de afluencia, total de visitantes y horas con baja actividad.",
        serviceCall: ReportService.downloadReporteAsistencia,
        icon: <GroupIcon sx={{ fontSize: 50, color: "#f44336" }} />,
        gradientLight: "linear-gradient(145deg, #ffebee, #ef9a9a)",
        gradientDark: "linear-gradient(145deg, #ffdada, #f28b82)",
    },
];

    const DownloadReports = () => {
    const [loading, setLoading] = React.useState(null);
    const theme = useTheme();
    const [popoverAnchors, setPopoverAnchors] = React.useState({});

    const handleOpenPopover = (event, reportId) => {
        setPopoverAnchors((prev) => ({ ...prev, [reportId]: event.currentTarget }));
    };

    const handleClosePopover = (reportId) => {
        setPopoverAnchors((prev) => ({ ...prev, [reportId]: null }));
    };

    const handleDownload = async (serviceCall, reportId) => {
        try {
            setLoading(reportId);

            const response = await serviceCall();

            const contentDisposition = response.headers["content-disposition"];
            console.log('contentDisposition:',contentDisposition);
            let fileName = "reporte.pdf";

            if (contentDisposition) {
                let match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);

                if (match && match[1]) {
                    fileName = decodeURIComponent(match[1]);
                } else {
                    match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match && match[1]) {
                        fileName = match[1];
                    }
                }
            }

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error descargando reporte:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: "100vh",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Descargar Reportes
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {reports.map((report) => {
                    const gradient =
                        theme.palette.mode === "dark"
                        ? report.gradientDark
                        : report.gradientLight;
                    return (
                        <Grid item xs={12} sm={6} md={3} key={report.id}>
                            <Card
                                sx={{
                                borderRadius: 3,
                                textAlign: "center",
                                p: 3,
                                background: gradient,
                                boxShadow:
                                    theme.palette.mode === "dark"
                                    ? "10px 10px 30px rgba(0,0,0,0.7), -10px -10px 30px rgba(0,0,0,0.3)"
                                    : "10px 10px 30px rgba(0,0,0,0.1), -10px -10px 30px rgba(255,255,255,0.7)",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "translateY(-10px)",
                                    boxShadow:
                                    theme.palette.mode === "dark"
                                        ? "12px 12px 35px rgba(0,0,0,0.8), -12px -12px 35px rgba(0,0,0,0.4)"
                                        : "12px 12px 35px rgba(0,0,0,0.15), -12px -12px 35px rgba(255,255,255,0.85)",
                                },
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "auto",
                                        mb: 1,
                                        backgroundColor:
                                            theme.palette.mode === "dark"
                                            ? "rgba(255,255,255,0.1)"
                                            : "rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        {report.icon}
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.mode === "dark" ? "#e0f2f1" : "#004d40",
                                                mr: 1,
                                            }}
                                        >
                                        {report.title}
                                        </Typography>
                                        <IconButton size="small" onClick={(e) => handleOpenPopover(e, report.id)}>
                                            <InfoIcon fontSize="small" sx={{ color: theme.palette.mode === "dark" ? "#498680" : "#455a64" }} />
                                        </IconButton>
                                    </Box>

                                    <Popover
                                        id={`popover-${report.id}`}
                                        open={Boolean(popoverAnchors[report.id])}
                                        anchorEl={popoverAnchors[report.id]}
                                        onClose={() => handleClosePopover(report.id)}
                                        anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                        }}
                                        transformOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                        }}
                                    >
                                        <Box sx={{ p: 2, maxWidth: 250 }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#eceff1" : "#37474f" }}>
                                            {report.description}
                                        </Typography>
                                        </Box>
                                    </Popover>
                                </CardContent>
                                <CardActions sx={{ justifyContent: "center", mb: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon sx={{ transition: "transform 0.3s" }} />}
                                    onClick={() => handleDownload(report.serviceCall, report.id)}
                                    disabled={loading === report.id}
                                    sx={{
                                        minWidth: "160px",
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        paddingY: 1.2,
                                        paddingX: 2.5,
                                        color: "#fff",
                                        background: theme.palette.mode === "dark"
                                        ? "linear-gradient(135deg, #1976d2, #1565c0)"
                                        : "linear-gradient(135deg, #1565c0, #0d47a1)",
                                        boxShadow: theme.palette.mode === "dark"
                                        ? "0 4px 15px rgba(0,0,0,0.5)"
                                        : "0 4px 15px rgba(0,0,0,0.2)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                        background: theme.palette.mode === "dark"
                                            ? "linear-gradient(135deg, #115293, #0d3c61)"
                                            : "linear-gradient(135deg, #0d3c61, #0a2a4d)",
                                        transform: "translateY(-3px)",
                                        boxShadow: theme.palette.mode === "dark"
                                            ? "0 8px 20px rgba(0,0,0,0.7)"
                                            : "0 8px 20px rgba(0,0,0,0.25)",
                                        "& .MuiSvgIcon-root": {
                                            transform: "scale(1.2)",
                                            color: "#ffeb3b",
                                        },
                                        },
                                        "&:disabled": {
                                        background: theme.palette.mode === "dark"
                                            ? "#1976d2"
                                            : "#1565c0",
                                        boxShadow: "none",
                                        color: "#ddd",
                                        },
                                    }}
                                    >
                                    {loading === report.id ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Descargar"
                                    )}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default DownloadReports;