import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, useTheme, Typography, TextField, Grid, Snackbar, Alert, Fade, ToggleButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import InfoUsuario from './InfoUsuario';
import ChecklistIcon from '@mui/icons-material/Checklist';

const Asistencias = ({ showInfo, clientId, handleInputChange, handleKeyDown, registrarAsistencia, setRegistrarAsistencia, error, openSnackbar, setOpenSnackbar, loading, cliente, fade }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box sx={{ 
      padding: 3, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start',
      position: 'relative'
    }}>
      <ChecklistIcon
        onClick={() => navigate('/asistencia/listado')}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          fontSize: 40,
          color: '#1976d2',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, color 0.3s ease',
          '&:hover': { 
            color: '#4caf50',
            transform: 'scale(1.1)'
          }
        }}
      />
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 3, marginTop: 0 }}>
        Asistencia
      </Typography>

      {!showInfo && (
        <Grid container spacing={2} justifyContent="flex-start" sx={{ marginTop: -2 }}>
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              label="Codigo"
              variant="outlined"
              value={clientId}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              fullWidth={false}
              margin="normal"
              sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 1 }}
            />
            <ToggleButton
              value="check"
              selected={registrarAsistencia}
              onChange={() => setRegistrarAsistencia((prev) => !prev)}
              sx={{ marginLeft: 2, height: '56px', marginTop: 2 }} 
            >
              <CheckIcon />
            </ToggleButton>
          </Grid>
        </Grid>
      )}

      {error && (
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress size={60} color="primary" />
        </Box>
      )}

      <Fade in={showInfo && fade} timeout={500}>
        <Grid container spacing={2}>
          {cliente && (
            <Grid item xs={12}>
              <InfoUsuario cliente={cliente} theme={theme} />
            </Grid>
          )}
        </Grid>
      </Fade>
    </Box>
  );
};
export default Asistencias;