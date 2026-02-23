import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const Reloj = () => {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const horaFormateada = hora.toLocaleTimeString("es-ES", { hour12: false });
  const fechaFormateada = hora.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const esDeDia = hora.getHours() >= 6 && hora.getHours() < 18;
  const colorTexto = esDeDia ? "#f5f745" : "#4fc3f7";
  const sombraFondo = esDeDia
    ? "0px 0px 20px rgba(255, 235, 59, 0.7)"
    : "0px 0px 20px rgba(79, 195, 247, 0.7)";

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Paper
        elevation={10}
        sx={{
          background: "rgba(30, 30, 30, 0.85)",
          backdropFilter: "blur(10px)",
          color: colorTexto,
          padding: "20px",
          borderRadius: "12px",
          textAlign: "center",
          minWidth: { xs: "90%", md: "auto" },
          boxShadow: sombraFondo,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          {esDeDia ? (
            <WbSunnyIcon sx={{ fontSize: 40, color: "#ffeb3b" }} />
          ) : (
            <BedtimeIcon sx={{ fontSize: 40, color: "#ff7043" }} />
          )}
          <Typography
            variant="h6"
            sx={{
              textTransform: "capitalize",
              color: "#fff",
              opacity: 0.85,
              fontWeight: "bold",
            }}
          >
            {fechaFormateada}
          </Typography>
        </Stack>
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 3,
            mt: 1,
            transition: "all 0.3s ease-in-out",
            textShadow: "0px 0px 10px rgba(79, 195, 247, 0.8)",
          }}
        >
          {horaFormateada}
        </Typography>
      </Paper>
    </Box>
  );
};
export default Reloj;