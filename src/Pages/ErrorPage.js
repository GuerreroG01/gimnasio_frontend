import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageNotFoundImage from '../assets/Images/Page_notFound.jpg';

const ErrorPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '90vh',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: 4,
            boxShadow: 3,
            p: { xs: 2, md: 2 },
          }}
        >
          <Box
            component="img"
            src={PageNotFoundImage}
            alt="Página no encontrada"
            sx={{
              maxWidth: '100%',
              height: 250,
              objectFit: 'contain',
              mb: 4,
            }}
          />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
          >
            ¡Ups! Página no encontrada
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 4, color: theme.palette.text.secondary }}
          >
            Lo sentimos, no pudimos encontrar la página que estás buscando.
            Puede que haya sido eliminada o que la dirección esté mal escrita.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Volver al inicio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
export default ErrorPage;