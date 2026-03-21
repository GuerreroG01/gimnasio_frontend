import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 2 },
      }}
    >
      <Container maxWidth={false}>
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow: 6,
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 4 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <LockOutlinedIcon
            sx={{
              fontSize: { xs: 80, sm: 100, md: 120 },
              color: theme.palette.error.main,
              mb: { xs: 2, sm: 3 },
              animation: 'bounce 1.5s infinite',
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            }}
          >
            ¡Acceso no autorizado!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
          >
            Lo sentimos, no tienes permisos para acceder a esta página.
            Puede que necesites iniciar sesión o contactar al administrador.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: { xs: 3, sm: 5 },
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 3,
              textTransform: 'none',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Volver al inicio
          </Button>

          <style>
            {`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
            `}
          </style>
        </Box>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;