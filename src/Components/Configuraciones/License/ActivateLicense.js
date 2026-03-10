import { useState } from "react";
import LicenseService from "../../../Services/LicenseService";
import { Paper, Typography, Box, Stack, TextField, Button, Avatar, CircularProgress } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import VerifiedIcon from "@mui/icons-material/Verified";

import CustomSnackbar from "../../../Shared/Components/CustomSnackbar";

const ActivateLicense = () => {
    const [licenseKey, setLicenseKey] = useState("");
    const [loading, setLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleActivate = async () => {
        if (!licenseKey) {
        setSnackbarMessage("Ingrese una licencia");
        setSeverity("warning");
        setSnackbarOpen(true);
        return;
        }

        try {
        setLoading(true);

        const response = await LicenseService.activateLicense(licenseKey);

        setSnackbarMessage(response.message);
        setSeverity("success");
        setSnackbarOpen(true);
        window.location.reload();

        setLicenseKey("");
        } catch (err) {
        setSnackbarMessage(err.message);
        setSeverity("error");
        setSnackbarOpen(true);
        } finally {
        setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography
            variant="h5"
            gutterBottom
            sx={{
                fontWeight: "bold",
                color: "primary.main"
            }}
            >
            <VerifiedIcon sx={{ fontSize: 40, verticalAlign: "middle", mr: 1 }} />
            Activar Licencia
            </Typography>

            <Box display="flex" flexDirection="row" gap={3}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, width: 400 }}>
                <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                    <KeyIcon fontSize="large" />
                </Avatar>

                <Box>
                    <Typography variant="h6" fontWeight="bold">
                    Activación de licencia
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                    Ingrese su clave de licencia para activar el sistema
                    </Typography>
                </Box>
                </Box>

                <Stack spacing={2}>
                <TextField
                    label="Clave de Licencia"
                    fullWidth
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                />

                <Button
                    variant="contained"
                    size="large"
                    onClick={handleActivate}
                    disabled={loading}
                >
                    {loading ? (
                    <CircularProgress size={24} color="inherit" />
                    ) : (
                    "Activar Licencia"
                    )}
                </Button>
                </Stack>
            </Paper>
            </Box>
        </Paper>

        <CustomSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={severity}
            onClose={handleCloseSnackbar}
        />
        </>
    );
};

export default ActivateLicense;