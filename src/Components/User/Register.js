import { Container, TextField, MenuItem, Button, Typography, Box, CircularProgress, Paper, Grid, useTheme, InputAdornment,
    Avatar, Chip } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CustomSnackbar from "../../Shared/Components/CustomSnackbar";

const Register = ({ formData, setFormData, handleSubmit, handleKeyPress, toggleActivo, snackbarInfo,
    isEdit = false }) => {
    const theme = useTheme();

    return (
        <Container
            maxWidth={false}
            sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                mb: 8,
            }}
        >
            <Paper
                elevation={12}
                sx={{
                width: "100%",
                maxWidth: 800,
                p: { xs: 3, sm: 5, md: 6 },
                borderRadius: 4,
                backgroundColor:
                    theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : "#ffffff",
                color: theme.palette.text.primary,
                position: "relative", // necesario para posicionar el chip
                }}
            >
                {/* Chip en la esquina superior derecha */}
                <Box
                sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                }}
                >
                <Chip
                    label={formData.activo ? "Activo" : "Inactivo"}
                    color={formData.activo ? "success" : "error"}
                    icon={formData.activo ? <CheckCircleIcon /> : <CancelIcon />}
                    onClick={toggleActivo}
                    sx={{ fontWeight: 600, cursor: "pointer", minWidth: 120 }}
                />
                </Box>

                {/* Avatar y título */}
                <Box textAlign="center" mb={4}>
                <Avatar
                    sx={{
                    bgcolor: theme.palette.primary.main,
                    width: { xs: 60, sm: 72 },
                    height: { xs: 60, sm: 72 },
                    mx: "auto",
                    mb: 2,
                    }}
                >
                    <AccountCircleIcon sx={{ fontSize: { xs: 32, sm: 40 } }} />
                </Avatar>
                <Typography
                    variant="h4"
                    sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.6rem", sm: "2rem" },
                    }}
                >
                    {isEdit ? "Editar Usuario" : "Crear Usuario"}
                </Typography>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Usuario"
                        name="usuario"
                        fullWidth
                        value={formData.usuario}
                        onChange={e => setFormData({ ...formData, usuario: e.target.value })}
                        onKeyDown={handleKeyPress}
                        required
                        variant="outlined"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <AccountCircleIcon color="action" />
                                </InputAdornment>
                            ),
                            },
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                        label={isEdit ? "Nueva Contraseña (opcional)" : "Contraseña"}
                        name="clave"
                        type="password"
                        fullWidth
                        value={formData.clave}
                        onChange={e => setFormData({ ...formData, clave: e.target.value })}
                        onKeyDown={handleKeyPress}
                        required={!isEdit}
                        variant="outlined"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            },
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        onKeyDown={handleKeyPress}
                        required
                        variant="outlined"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                            },
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                        label="Teléfono"
                        name="telefono"
                        fullWidth
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                        onKeyDown={handleKeyPress}
                        required
                        variant="outlined"
                        slotProps={{
                            input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                <PhoneIcon color="action" />
                                </InputAdornment>
                            ),
                            },
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Rol"
                            name="rol"
                            fullWidth
                            value={formData.rol || "Empleado"}
                            onChange={e => setFormData({ ...formData, rol: e.target.value })}
                            required
                            variant="outlined"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        >
                            <MenuItem value="Admin">Administrador</MenuItem>
                            <MenuItem value="Empleado">Empleado</MenuItem>
                            <MenuItem value="Cliente">Cliente</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                    }}
                    onClick={handleSubmit}
                    disabled={snackbarInfo.loading}
                >
                    {snackbarInfo.loading
                    ? <CircularProgress size={24} />
                    : isEdit
                    ? "Actualizar Usuario"
                    : "Registrarse"}
                </Button>
                </Box>

                <CustomSnackbar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                severity={snackbarInfo.severity}
                onClose={snackbarInfo.onClose}
                autoHideDuration={3000}
                />
            </Paper>
        </Container>
    );
};
export default Register;