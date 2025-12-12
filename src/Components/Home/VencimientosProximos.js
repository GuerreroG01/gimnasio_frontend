import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography, CircularProgress, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, TextField } from "@mui/material";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PagoService from "../../Services/PagoService";
//import PagoRapidoPopover from "./PagoRapido";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';

const VencimientosProximos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuariosRenovados, setUsuariosRenovados] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await PagoService.getVencimientosProximos();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener vencimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenPopover = (event, usuario) => {
    setAnchorEl(event.currentTarget);
    setUsuarioSeleccionado(usuario);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setUsuarioSeleccionado(null);
  };

  const handlePagoRenovado = (usuarioId) => {
    setUsuariosRenovados((prev) => [...prev, usuarioId]);
    setTimeout(() => {
      setUsuarios((prev) => prev.filter((u) => u.codigo !== usuarioId));
      setUsuariosRenovados((prev) => prev.filter((id) => id !== usuarioId));
    }, 1500);

    handleClosePopover();
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  return (
    <Card elevation={3} sx={{ width: "100%", height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" color="primary">
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
                    setFiltroNombre('');
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <TextField
                  variant="filled"
                  size="small"
                  placeholder="Buscar..."
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>
            </Slide>

            <Zoom in={!mostrarFiltro} style={{ transitionDelay: !mostrarFiltro ? '300ms' : '0ms' }}>
              <IconButton onClick={() => setMostrarFiltro(true)}>
                <SearchIcon />
              </IconButton>
            </Zoom>
          </Box>
        }
      />
      <CardContent sx={{ maxHeight: 300, overflowY: 'auto', pt: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        ) : usuariosFiltrados.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay vencimientos próximos.
          </Typography>
        ) : (
          <List dense>
            {usuariosFiltrados.map((u) => {
              const isRenovado = usuariosRenovados.includes(u.codigo);
              const daysUntilExpiry = u.diasRestantes;

              let bgColor, textColor, icon, textVencimiento;

              if (isRenovado) {
                bgColor = '#C8E6C9';
                textColor = '#2E7D32';
                icon = <CheckCircleOutlineIcon />;
                textVencimiento = `Pago Renovado de ${u.nombreCompleto}`;
              } else if (daysUntilExpiry < 0) {
                bgColor = '#ffcdd2';
                textColor = '#B71C1C';
                icon = <WarningIcon />;
                textVencimiento = `Venció el ${u.fechaVencimiento}`;
              } else if (daysUntilExpiry === 0) {
                bgColor = '#ffcdd2';
                textColor = '#F57F17';
                icon = <WarningIcon />;
                textVencimiento = 'Vence hoy';
              } else if (daysUntilExpiry < 5) {
                bgColor = '#FFF9C4';
                textColor = '#F57F17';
                icon = <AccessTimeIcon />;
                textVencimiento = `Vence en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? 's' : ''} - ${u.fechaVencimiento}`;
              } else {
                bgColor = '#e0e0e0';
                textColor = '#616161';
                icon = <AccessTimeIcon />;
                textVencimiento = `Vence en ${daysUntilExpiry} día${daysUntilExpiry !== 1 ? 's' : ''} - ${u.fechaVencimiento}`;
              }

              return (
                <ListItem
                  key={u.codigo}
                  sx={{
                    backgroundColor: bgColor,
                    borderRadius: 1,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: textColor,
                    boxShadow: 1,
                    '&:hover': { boxShadow: 3 }
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: textColor }}>
                        {icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={u.nombreCompleto}
                      secondary={
                        <Typography variant="body2" color={textColor}>
                          {textVencimiento}
                        </Typography>
                      }
                    />
                  </Box>
                  {!isRenovado && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AutorenewIcon />}
                      onClick={(e) => handleOpenPopover(e, u)}
                    >
                      Renovar
                    </Button>
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
        {/*<PagoRapidoPopover
          anchorEl={anchorEl}
          usuario={usuarioSeleccionado}
          onClose={handleClosePopover}
          onPagoRenovado={handlePagoRenovado}
        />*/}
      </CardContent>
    </Card>
  );
};
export default VencimientosProximos;