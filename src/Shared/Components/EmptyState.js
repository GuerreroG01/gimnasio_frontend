import { Box, Typography } from "@mui/material";

const EmptyState = ({ 
    title = "Nada aquí", 
    message = "No hay elementos para mostrar.", 
    Icon = null, 
    minHeight = 260 
}) => {
    return (
        <Box
            sx={{
                minHeight: minHeight,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 3,
                background:
                "linear-gradient(145deg, rgba(25,118,210,0.06), rgba(25,118,210,0.12))",
                position: "relative",
                overflow: "hidden",
                p: 2,
            }}
            >
            {Icon && (
                <Box
                sx={{
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    background:
                    "linear-gradient(135deg, rgba(25,118,210,0.25), rgba(25,118,210,0.1))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    boxShadow: "0 8px 24px rgba(25,118,210,0.25)",
                }}
                >
                <Icon sx={{ fontSize: 52, color: "primary.main" }} />
                </Box>
            )}

            <Typography variant="h6" fontWeight={600}>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 260 }}
            >
                {message}
            </Typography>
        </Box>
    );
};
export default EmptyState;