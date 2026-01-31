import { Container, TextField, Button, Typography, Box, Alert, CircularProgress, Snackbar, Paper } from "@mui/material";
import { Lock } from "@mui/icons-material";

const Login = ({ handleLogin, handleKeyPress, username, setUsername, clave, setClave, error, loading,
    openSnackbar, setOpenSnackbar, navigate }) => {

    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Paper 
                    elevation={6} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3, 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Lock sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        Iniciar Sesión
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}

                    <TextField
                        label="Usuario"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyPress}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        onKeyDown={handleKeyPress}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Ingresar"}
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            borderRadius: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                        onClick={() => navigate("/programas")}
                        disabled={loading}
                    >
                        Programas
                    </Button>
                </Paper>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    message="¡Login exitoso!"
                />
            </Box>
        </Container>
    );
};
export default Login;