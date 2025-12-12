import React from 'react';
import { Box, IconButton, Button, Drawer, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
const authToken = localStorage.getItem("authToken");

const NAV_LINKS = [
  { label: "Login", path: "/Login", public: true },
  { label: "Usuarios", path: "/usuario", public: false },
  { label: "Pagos y Ejercicios", path: "/IndexTipoEjer_y_Pago", public: false },
  { label: "Productos", path: "/productos", public: false },
  { label: "Pagos", path: "/pagos", public: false },
  { label: "Mensajes", path: "/mensajes", public: false },
];

const NavegacionMovil = ({ openDrawer, toggleDrawer, isActive }) => {
  const navigate = useNavigate();
  const handleLinkClick = () => {
    toggleDrawer();
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toggleDrawer();
    navigate("/Login");
    window.location.reload();
  };

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      <Tooltip title="Operaciones">
        <IconButton onClick={toggleDrawer} color="inherit">
          <MenuOpenIcon sx={{ fontSize: 30, color: '#555' }} />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '240px',
          },
        }}
      >
        <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {NAV_LINKS.map(({ label, path, public: isPublic }) => (
            (isPublic || authToken) && (
              <Button
                key={path}
                component={Link}
                to={path}
                onClick={handleLinkClick}
                sx={{
                  display: 'block',
                  width: '100%',
                  color: isActive(path) ? '#28A745' : '#000',
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    color: '#28A745',
                    backgroundColor: '#f1f1f1',
                  },
                }}
              >
                {label}
              </Button>
            )
          ))}
          {authToken && (
            <Button
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'flex-start',
                color: '#d32f2f',
                padding: '10px 20px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  color: '#ffffff',
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              <LogoutIcon sx={{ marginRight: '10px' }} />
              Salir
            </Button>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};
export default NavegacionMovil;