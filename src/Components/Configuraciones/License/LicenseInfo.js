import { Paper, Typography, Box, Stack, Chip, Avatar, Divider } from "@mui/material";

import KeyIcon from "@mui/icons-material/Key";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";

const LicenseInfo = ({ license }) => {
    const isValid = license && new Date(license.expiresAt) >= new Date();

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: "95%" }}>
        <Typography
            variant="h5"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}
        >
            <VerifiedIcon sx={{ fontSize: 40, verticalAlign: "middle", mr: 1 }} />
            Información de Licencia
        </Typography>

        <Divider sx={{ mb: 3 }} />


        <Box display="flex" flexDirection="row" gap={3} width="100%">
            <Paper 
            elevation={3} 
            sx={{ p: 3, borderRadius: 2, flexGrow: 1, width: "100%" }}
            >
            <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                <BusinessIcon fontSize="large" />
                </Avatar>

                <Box>
                <Typography variant="h5" fontWeight="bold">
                    {license.businessName}
                </Typography>

                <Chip
                    label={isValid ? "Licencia Activa" : "Licencia Expirada"}
                    color={isValid ? "success" : "error"}
                    size="small"
                    sx={{ mt: 1 }}
                />
                </Box>
            </Box>

            <Stack spacing={1}>
                <Box display="flex" alignItems="center">
                <KeyIcon sx={{ mr: 1, color: "gray" }} />
                <Typography>{license.licenseKey}</Typography>
                </Box>

                <Box display="flex" alignItems="center">
                <VerifiedIcon sx={{ mr: 1, color: "gray" }} />
                <Typography>Plan: {license.plan}</Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Box display="flex" alignItems="center">
                <CalendarTodayIcon sx={{ mr: 1, color: "gray" }} />
                <Typography>
                    Expira: {new Date(license.expiresAt).toLocaleDateString()}
                </Typography>
                </Box>
            </Stack>
            </Paper>
        </Box>
        </Paper>
    );
};

export default LicenseInfo;