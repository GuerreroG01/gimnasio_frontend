import { Container, TextField, Button, Typography, Box, CircularProgress, Paper, IconButton, Tooltip, useTheme } from "@mui/material";
import { Lock, FitnessCenter, TrendingUp } from "@mui/icons-material";
import CustomSnackbar from "../../Shared/Components/CustomSnackbar";

const Login = ({ handleLogin, handleKeyPress, username, setUsername, clave, setClave, loading, snackbar, setSnackbar,
    navigate }) => {
        const theme = useTheme();
        const isDark = theme.palette.mode === "dark";

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: theme.palette.paper
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        width: '100%',
                        maxWidth: 480,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                    }}
                >
                    <Lock sx={{ fontSize: 70, mb: 1, color: isDark ? '#FF8C42' : '#FF512F' }} />
                    <Typography variant="h4" fontWeight="bold" align="center">
                        ¡Bienvenido a System-Gym!
                    </Typography>

                    <TextField
                        label="Usuario"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={handleKeyPress}
                        sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        backgroundColor: isDark ? '#2a2a2a' : '#fff',
                        }}
                        InputLabelProps={{
                        style: { color: isDark ? '#ccc' : '#333' },
                        }}
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
                        sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        backgroundColor: isDark ? '#2a2a2a' : '#fff',
                        }}
                        InputLabelProps={{
                        style: { color: isDark ? '#ccc' : '#333' },
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                        mt: 2,
                        py: 1.8,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        background: isDark
                            ? 'linear-gradient(45deg, #FF8C42, #FF5722)'
                            : 'linear-gradient(45deg, #FF512F, #DD2476)',
                        '&:hover': {
                            background: isDark
                            ? 'linear-gradient(45deg, #FF5722, #FF8C42)'
                            : 'linear-gradient(45deg, #DD2476, #FF512F)',
                        }
                        }}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Ingresar"}
                    </Button>

                    <Box display="flex" justifyContent="center" gap={2} mt={1}>
                        <Tooltip title="Ver Programas">
                        <IconButton
                            color="primary"
                            onClick={() => navigate("/programas")}
                            sx={{
                            backgroundColor: isDark ? '#333' : '#FFEBEE',
                            '&:hover': {
                                backgroundColor: isDark ? '#444' : '#FFCDD2',
                            }
                            }}
                        >
                            <FitnessCenter />
                        </IconButton>
                        </Tooltip>

                        <Tooltip title="Ver Progreso">
                        <IconButton
                            color="secondary"
                            onClick={() => navigate("/progresos")}
                            sx={{
                            backgroundColor: isDark ? '#333' : '#FFEBEE',
                            '&:hover': {
                                backgroundColor: isDark ? '#444' : '#FFCDD2',
                            }
                            }}
                        >
                            <TrendingUp />
                        </IconButton>
                        </Tooltip>
                    </Box>
                </Paper>

                <CustomSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                />
            </Box>
        </Container>
    );
};
export default Login;