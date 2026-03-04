import React from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, Divider, AppBar, Toolbar, Tooltip, Avatar, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { AuthContext } from '../../Context/AuthContext';
import { ThemeContext } from '../../Context/ThemeContext';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const NAV_LINKS = [
  { label: "Clientes", path: "/clientes" },
  { label: "Pagos", path: "/pagos" },
  { label: "Productos", path: "/productos" },
  { label: "Ventas", path: "/venta" },
  { label: "Programas", path: "/programas" },
  { label: "Progresos", path: "/progresos" },
];

const NavegacionMovil = ({ isActive }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { usuario, rol, logout } = React.useContext(AuthContext);
  const { darkMode, toggleDarkMode } = React.useContext(ThemeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const handleAvatarClick = () => {
    navigate("/");
  };

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: darkMode
            ? '0 4px 12px rgba(100, 120, 140, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box 
            sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: rol === "Admin" ? theme.palette.warning.main : theme.palette.success.main,
                fontSize: 14,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {rol === "Admin" ? <ManageAccountsIcon sx={{ fontSize: 20, color: '#fff' }} /> : usuario?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, lineHeight: 1 }}
              >
                Bienvenido
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2
                }}
              >
                {usuario?.toUpperCase()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title={darkMode ? "Modo Claro" : "Modo Oscuro"}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={toggleDarkMode}
                  sx={{
                    width: "100%",
                    height: "100%",
                    color: theme.palette.text.secondary,
                  }}
                >
                  <WbSunnyIcon
                    sx={{
                      fontSize: 22,
                      position: "absolute",
                      transition: "all 0.4s ease",
                      transform: darkMode
                        ? "rotate(180deg) scale(0)"
                        : "rotate(0deg) scale(1)",
                      opacity: darkMode ? 0 : 1,
                    }}
                  />
                  <DarkModeIcon
                    sx={{
                      fontSize: 22,
                      position: "absolute",
                      transition: "all 0.4s ease",
                      transform: darkMode
                        ? "rotate(0deg) scale(1)"
                        : "rotate(-180deg) scale(0)",
                      opacity: darkMode ? 1 : 0,
                    }}
                  />
                </IconButton>
              </Box>
            </Tooltip>

            <IconButton
              onClick={handleOpen}
              sx={{
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: 260,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: darkMode
                ? "0 8px 24px rgba(0,0,0,0.6)"
                : "0 8px 24px rgba(0,0,0,0.12)",
            }
          }
        }}
      >
        {NAV_LINKS.map(({ label, path }) => (
          <MenuItem
            key={path}
            component={Link}
            to={path}
            onClick={handleClose}
            selected={isActive(path)}
            sx={{
              fontWeight: isActive(path) ? 600 : 400,
              color: isActive(path)
                ? theme.palette.success.main
                : theme.palette.text.primary,
            }}
          >
            {label}
          </MenuItem>
        ))}

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ color: theme.palette.error.main }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Cerrar sesión
        </MenuItem>
      </Menu>
    </Box>
  );
};
export default NavegacionMovil;