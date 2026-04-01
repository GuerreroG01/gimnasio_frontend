import React from 'react';
import { Box, Button, useTheme, IconButton, Typography, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem } from '@mui/material';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import GymLogo from '../../assets/Images/logo-gym.avif';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import NavegacionMovil from './NavegacionMovil';
import { AuthContext } from '../../Context/AuthContext';
import MensajeBadge from './MensajeBadge';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from '../../Context/ThemeContext';
import UpgradeLicense from '../../Shared/Components/UpgradeLicense';
const Logo = styled('img')({
  width: 50,
  height: 50,
  borderRadius: '50%',
  marginRight: '16px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.1)',
  },
});

const Navegacion = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout, rol, plan } = React.useContext(AuthContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const { darkMode, toggleDarkMode } = React.useContext(ThemeContext);
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openUpgradeDialog, setOpenUpgradeDialog] = React.useState(false);
  const BASIC = [
    "/", 
    "/clientes", 
    "/pagos", 
    "/asistencia", 
    "/membresias", 
    "/reports",
    "/configuraciones"
  ];

  const PRO = [
    ...BASIC,
    "/productos",
    "/venta",
    "/mensajes",
  ];

  const allowedRoutesByPlan = {
    BASIC,
    PRO,
    FULL: ["*"], 
  };
  const isSuperAdmin = rol?.toUpperCase() === "SUPERADMIN";
  const canAccessRoute = (route) => {
    if (isSuperAdmin) return true;
    const normalizedPlan = plan?.toUpperCase() || "BASIC";
    const allowedRoutes = allowedRoutesByPlan[normalizedPlan] || [];
    
    return allowedRoutes.includes("*") || allowedRoutes.includes(route);
  };
  const NAV_LINKS = [
    { label: "Clientes", path: "/clientes" },
    {
      label: "Operaciones", children: [
        { label: "Pagos", path: "/pagos" },
        { label: "Productos", path: "/productos" },
        { label: "Ventas", path: "/venta" },
        { label: "Programas", path: "/programas" },
        { label: "Progresos", path: "/progresos" },
        ...(rol === "Admin" ? [{ label: "Reportes", path: "/reports" }] : [])
      ]
    }
  ];
  const handleLogout = () => {
    setOpenDialog(false);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 300);
  };

  const isActive = (path) => location.pathname.startsWith(path);
  const isMessagesPage= location.pathname === '/mensajes';
  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);
  
  return (
    <>
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.background.paper,
        padding: { xs: '8px 16px', md: '10px 32px' },
        boxShadow: darkMode
          ? '0 4px 12px rgba(100, 120, 140, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        gap: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link to="/"><Logo src={GymLogo} alt="Gym Logo" /></Link>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, textTransform: 'uppercase' }}>
            System-GYM
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <Box key={link.label}>
                    <Button
                      onClick={handleMenuOpen}
                      sx={{
                        color: link.children.some(c => isActive(c.path))
                          ? theme.palette.success.main
                          : theme.palette.text.primary,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: theme.palette.action.hover, transform: 'scale(1.05)' },
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {link.label}
                    </Button>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor)}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    >
                      {link.children.map((child) => (
                        <MenuItem
                          key={child.path}
                          component={Link}
                          to={child.path}
                          onClick={(e) => {
                            if (!canAccessRoute(child.path)) {
                              e.preventDefault();
                              setOpenUpgradeDialog(true);
                              handleMenuClose();
                            } else {
                              handleMenuClose();
                            }
                          }}
                          selected={isActive(child.path)}
                        >
                          {child.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                );
              }
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: isActive(link.path)
                      ? theme.palette.success.main
                      : theme.palette.text.primary,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: theme.palette.action.hover, transform: 'scale(1.05)' },
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Usuario + ajustes + logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, display: { xs: 'none', md: 'block' }, color: theme.palette.text.primary }}>
            Hola, <strong>{usuario?.toUpperCase()}</strong>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {canAccessRoute("/mensajes") && (
              <Tooltip title="Mensajes">
                <Link to="/mensajes">
                  <Box sx={{ cursor: 'pointer' }}>
                    <MensajeBadge isActive={isMessagesPage} />
                  </Box>
                </Link>
              </Tooltip>
            )}

            <Tooltip title="Asistencia">
              <Link to="/asistencia">
                <IconButton
                  sx={{
                    color: isActive('/asistencia') 
                      ? theme.palette.success.main 
                      : theme.palette.text.secondary,
                    '&:hover': { bgcolor: theme.palette.action.hover },
                    padding: 0.5,
                  }}
                >
                  <PersonPinCircleIcon sx={{ fontSize: 26 }} />
                </IconButton>
              </Link>
            </Tooltip>

            <Tooltip title="Ajustes">
              <Box sx={{ cursor: 'pointer' }}>
                <IconButton
                  onClick={(e) => {
                    if (!canAccessRoute("/configuraciones")) {
                      e.preventDefault();
                      setOpenUpgradeDialog(true);
                    } else {
                      navigate("/configuraciones");
                    }
                  }}
                  sx={{
                    color: isActive('/configuraciones') 
                      ? theme.palette.success.main 
                      : theme.palette.text.secondary,
                    '&:hover': { bgcolor: theme.palette.action.hover },
                    padding: 0.5,
                  }}
                >
                  <SettingsIcon sx={{ fontSize: 26 }} />
                </IconButton>
              </Box>
            </Tooltip>

            <Tooltip title={darkMode ? "Modo Claro" : "Modo Oscuro"}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    color: theme.palette.text.secondary,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    padding: 0,
                  }}
                >
                  <WbSunnyIcon
                    sx={{
                      fontSize: 26,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: darkMode
                        ? 'translate(-50%, -50%) rotate(180deg) scale(0)'
                        : 'translate(-50%, -50%) rotate(0deg) scale(1)',
                      opacity: darkMode ? 0 : 1,
                      transition: 'all 0.4s ease',
                    }}
                  />
                  <DarkModeIcon
                    sx={{
                      fontSize: 26,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: darkMode
                        ? 'translate(-50%, -50%) rotate(0deg) scale(1)'
                        : 'translate(-50%, -50%) rotate(-180deg) scale(0)',
                      opacity: darkMode ? 1 : 0,
                      transition: 'all 0.4s ease',
                    }}
                  />
                </IconButton>
              </Box>
            </Tooltip>

            <Tooltip title="Cerrar Sesión">
              <IconButton
                color="error"
                size="small"
                onClick={() => setOpenDialog(true)}
                sx={{ '&:hover': { bgcolor: 'error.light' }, padding: 0.5 }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Confirmar salida</DialogTitle>
          <DialogContent>
            <DialogContentText>¿Estás seguro de que deseas cerrar sesión?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">Cancelar</Button>
            <Button onClick={handleLogout} color="error">Salir</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <NavegacionMovil openDrawer={openDrawer} toggleDrawer={() => setOpenDrawer(!openDrawer)} isActive={isActive} setOpenUpgradeDialog={setOpenUpgradeDialog}
        isMessagesPage={isMessagesPage} canAccessRoute={canAccessRoute}
      />
      <Box sx={{ padding: 2 }}>
        {children || <Outlet />}
      </Box>
      <UpgradeLicense
        open={openUpgradeDialog}
        onClose={() => setOpenUpgradeDialog(false)}
        currentPlan={plan?.toUpperCase()}
      />
    </>
  );
};
export default Navegacion;