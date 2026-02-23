import React, { useEffect } from "react";
import { alpha } from "@mui/material/styles";
import { Card, CardHeader, CardContent, Typography, CircularProgress, Box, List, ListItem, ListItemAvatar,
  Avatar, ListItemText, Button, TextField, IconButton, Slide, Zoom, useTheme, Collapse } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WarningIcon from "@mui/icons-material/Warning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PagoService from "../../Services/PagoService";
import PagoRapido from "./PagoRapido";

const VencimientosProximos = () => {
  const theme = useTheme();
  const [clientes, setClientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(null);
  const [clientesRenovados, setClientesRenovados] = React.useState([]);
  const [filtroNombre, setFiltroNombre] = React.useState("");
  const [mostrarFiltro, setMostrarFiltro] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PagoService.getVencimientosProximos();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener vencimientos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenPopover = (event, cliente) => {
    setAnchorEl(event.currentTarget);
    setClienteSeleccionado(cliente);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setClienteSeleccionado(null);
  };

  const handlePagoRenovado = (clienteId) => {
    setClientesRenovados((prev) => [...prev, clienteId]);

    setTimeout(() => {
      setClientes((prev) => prev.filter((c) => c.codigo !== clienteId));
      setClientesRenovados((prev) => prev.filter((id) => id !== clienteId));
    }, 600);

    handleClosePopover();
  };

  const clientesFiltrados = clientes.filter((c) =>
    c.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #1e1e1e, #121212)"
            : "#ffffff",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5 }}
          >
            Vencimientos próximos
          </Typography>
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <Slide direction="left" in={mostrarFiltro} mountOnEnter unmountOnExit>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={() => {
                    setMostrarFiltro(false);
                    setFiltroNombre("");
                  }}
                  sx={{ bgcolor: theme.palette.action.hover }}
                >
                  <CloseIcon />
                </IconButton>

                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Buscar..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>
            </Slide>

            <Zoom in={!mostrarFiltro}>
              <IconButton
                onClick={() => setMostrarFiltro(true)}
                sx={{
                  bgcolor: theme.palette.action.hover,
                  "&:hover": {
                    bgcolor: theme.palette.action.selected,
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Zoom>
          </Box>
        }
      />

      <CardContent className="scroll-hide" sx={{ maxHeight: 320, overflowY: "auto", pt: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress size={26} />
          </Box>
        ) : clientesFiltrados.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mt={2}
          >
            No hay vencimientos próximos.
          </Typography>
        ) : (
          <List disablePadding>
            {clientesFiltrados.map((c) => {
              const isRenovado = clientesRenovados.includes(c.codigo);
              const days = c.diasRestantes;

              let color;
              let icon;
              let textVencimiento;
              let backgroundColor;
              if (isRenovado) {
                color = theme.palette.success.main;
                backgroundColor = alpha(theme.palette.success.main, 0.15);
                icon = <CheckCircleOutlineIcon fontSize="small" />;
                textVencimiento = "Pago renovado correctamente";

              } else if (days < 0) {
                color = theme.palette.error.main;
                backgroundColor = alpha(theme.palette.error.main, 0.15);
                icon = <WarningIcon fontSize="small" />;
                textVencimiento = `Venció el ${c.fechaVencimiento}`;

              } else if (days === 0) {
                color = theme.palette.warning.main;
                backgroundColor = alpha(theme.palette.warning.main, 0.15);
                icon = <WarningIcon fontSize="small" />;
                textVencimiento = "Vence hoy";

              } else if (days <= 3) {
                color = theme.palette.warning.main;
                backgroundColor = alpha(theme.palette.warning.main, 0.1);
                icon = <AccessTimeIcon fontSize="small" />;
                textVencimiento = `Vence en ${days} día${days !== 1 ? "s" : ""} - ${c.fechaVencimiento}`;

              } else if (days <= 7) {
                color = theme.palette.info.main;
                backgroundColor = alpha(theme.palette.info.main, 0.1);
                icon = <AccessTimeIcon fontSize="small" />;
                textVencimiento = `Vence en ${days} días - ${c.fechaVencimiento}`;

              } else {
                color = theme.palette.success.main;
                backgroundColor = alpha(theme.palette.success.main, 0.1);
                icon = <AccessTimeIcon fontSize="small" />;
                textVencimiento = `Vence en ${days} días - ${c.fechaVencimiento}`;
              }

              return (
                <Collapse key={c.codigo} in={!isRenovado} timeout={400}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1.5,
                      px: 2,
                      py: 1.5,
                      backgroundColor: backgroundColor,
                      borderLeft: `5px solid ${color}`,
                      transition: "all 0.25s ease",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `${color}20`,
                              color: color,
                              width: 36,
                              height: 36,
                            }}
                          >
                            {icon}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>
                              {c.nombreCompleto}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{ opacity: 0.75, mt: 0.5 }}
                            >
                              {textVencimiento}
                            </Typography>
                          }
                        />
                      </Box>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AutorenewIcon />}
                        onClick={(e) => handleOpenPopover(e, c)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          boxShadow: "none",
                        }}
                      >
                        Renovar
                      </Button>
                    </Box>
                  </ListItem>
                </Collapse>
              );
            })}
          </List>
        )}

        <PagoRapido
          anchorEl={anchorEl}
          cliente={clienteSeleccionado}
          onClose={handleClosePopover}
          onPagoRenovado={handlePagoRenovado}
        />
      </CardContent>
    </Card>
  );
};
export default VencimientosProximos;