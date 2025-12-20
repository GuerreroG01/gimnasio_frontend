import React from 'react';
import { Box, Button, IconButton, Typography, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem } from '@mui/material';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import GymLogo from '../../assets/Images/gym-logo.png';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import NavegacionMovil from './NavegacionMovil';
import { AuthContext } from '../../Context/AuthContext';

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

const NAV_LINKS = [
  { label: "Clientes", path: "/clientes" },
  { label: "Operaciones", children: [
      { label: "Pago", path: "/pagos" },
      { label: "Productos", path: "/productos" }
  ]}
];

const Navegacion = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, usuario, logout } = React.useContext(AuthContext);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const handleLogout = () => {
    setOpenDialog(false);
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 300);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <>
      {/* --- Barra de navegación --- */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: { xs: '8px 16px', md: '10px 32px' },
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        gap: 2,
      }}>
        {/* Logo + Navegación izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link to="/"><Logo src={GymLogo} alt="Gym Logo" /></Link>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', textTransform: 'uppercase' }}>
            System-GYM
          </Typography>

          {/* Menú de navegación */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {NAV_LINKS.map((link) => {
              if (link.children) {
                return (
                  <Box key={link.label}>
                    <Button
                      onClick={handleMenuOpen}
                      sx={{
                        color: link.children.some(c => isActive(c.path)) ? '#28A745' : '#000',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#f1f1f1', transform: 'scale(1.05)' },
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
                          onClick={handleMenuClose}
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
                    color: isActive(link.path) ? '#28A745' : '#000',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#f1f1f1', transform: 'scale(1.05)' },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {authenticated ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 500, display: { xs: 'none', md: 'block' } }}>
                Hola, <strong>{usuario?.toUpperCase()}</strong>
              </Typography>

              <Tooltip title="Asistencia">
                <Link to="/asistencia">
                  <IconButton>
                    <PersonPinCircleIcon sx={{ fontSize: 26, color: isActive('/asistencia') ? '#28A745' : '#555' }} />
                  </IconButton>
                </Link>
              </Tooltip>

              <Tooltip title="Ajustes">
                <Link to="/configuraciones">
                  <IconButton>
                    <SettingsIcon sx={{ fontSize: 26, color: isActive('/configuraciones') ? '#28A745' : '#555' }} />
                  </IconButton>
                </Link>
              </Tooltip>

              <NavegacionMovil openDrawer={false} toggleDrawer={() => {}} isActive={isActive} />

              <Button color="error" variant="outlined" onClick={() => setOpenDialog(true)} size="small">
                Salir
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" color="primary" variant="contained" size="small">
              Iniciar Sesión
            </Button>
          )}
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

      <Box sx={{ padding: 2 }}>
        {children || <Outlet />}
      </Box>
    </>
  );
};
export default Navegacion;