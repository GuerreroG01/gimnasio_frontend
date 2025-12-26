import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import { useExistencias } from '../../Context/ExistenciaContext';

const DatosVenta = ({ productoSeleccionado, cantidad, setCantidad, setTotal, setError, handleregistrarDatos, total, ventaActual }) => {
  const [precioEspecial, setPrecioEspecial] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productoOriginal, setProductoOriginal] = useState(null);
  const [fechaVenta, setFechaVenta] = useState(null);
  const { existencias } = useExistencias();

  const existenciasActual = existencias['producto']?.[productoSeleccionado?.codigoProducto] ?? productoSeleccionado?.existencias ?? 0;

  useEffect(() => {
    if (ventaActual && ventaActual.codigoProducto) {
      setProductoOriginal({ codigoProducto: ventaActual.codigoProducto });
      setFechaVenta(ventaActual.fecha_venta || new Date().toISOString());
      if (productoSeleccionado && productoSeleccionado.codigoProducto === ventaActual.codigoProducto) {
        setPrecioEspecial(
          ventaActual.total !== ventaActual.art_vendidos * productoSeleccionado.precio ? ventaActual.total : null
        );
      } else {
        setPrecioEspecial(null);
      }
    } else {
      setFechaVenta(new Date().toISOString());
    }
  }, [ventaActual, productoSeleccionado]);

  useEffect(() => {
    if (productoSeleccionado) {
      setTotal(precioEspecial !== null ? precioEspecial : cantidad * productoSeleccionado.precio);
    }
  }, [cantidad, precioEspecial, productoSeleccionado, setTotal]);

  const handleCantidadChange = (event) => {
    const nuevaCantidad = parseInt(event.target.value, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) return;
    if (nuevaCantidad > productoSeleccionado.existencias) {
      setError('No hay suficientes existencias.');
    } else {
      setCantidad(nuevaCantidad);
    }
  };

  const handlePrecioEspecialChange = (event) => {
    const nuevoPrecioTotal = parseFloat(event.target.value);
    if (!isNaN(nuevoPrecioTotal) && nuevoPrecioTotal > 0) {
      setPrecioEspecial(nuevoPrecioTotal);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      if (productoSeleccionado?.codigoProducto === productoOriginal?.codigoProducto) {
        setPrecioEspecial(ventaActual.total);
      } else {
        setPrecioEspecial(null);
      }
    }
  };

  const handleCompletarVenta = async () => {
    setIsLoading(true);
    const totalVenta = precioEspecial !== null ? precioEspecial : total;
    await handleregistrarDatos(totalVenta);
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: 3,
        maxWidth: "350px",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        alignItems: "center",
        marginTop: 2,
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}>
          Datos de la Venta
        </Typography>

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            backgroundColor: "#f1f1f1",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {new Date(fechaVenta).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <Typography variant="body2" color="textSecondary" align="center" sx={{ fontWeight: "bold", marginBottom: 1 }}>
        {productoSeleccionado.descripcion}
      </Typography>

      <Divider sx={{ marginBottom: 1 }} />

      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
        Precio Unitario:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        ${productoSeleccionado.precio}
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
        Existencias Restantes:
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {existenciasActual}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Cantidad:
        </Typography>
        <TextField
          value={cantidad}
          onChange={handleCantidadChange}
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          inputProps={{
            min: 1,
            max: productoSeleccionado.existencias,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            width: "70px",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Total:
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold", marginRight: 1 }}>
            ${precioEspecial !== null ? precioEspecial : total}
          </Typography>
          <IconButton onClick={toggleEditing} size="small">
            {isEditing ? (
              <EditOffIcon sx={{ fontSize: 18, color: "#1976d2" }} />
            ) : (
              <EditIcon sx={{ fontSize: 18, color: "#1976d2" }} />
            )}
          </IconButton>
          {isEditing && (
            <TextField
              value={precioEspecial || ""}
              onChange={handlePrecioEspecialChange}
              variant="outlined"
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{
                width: "70px",
                fontSize: "14px",
                padding: "0 5px",
                borderRadius: "4px",
                "& .MuiOutlinedInput-root": { borderRadius: "4px" },
              }}
            />
          )}
        </Box>
      </Box>

      <Button
        variant="outlined"
        color="success"
        fullWidth
        sx={{
          marginTop: 2,
          padding: "8px",
          fontWeight: "bold",
          borderRadius: "8px",
          textTransform: "none",
        }}
        onClick={handleCompletarVenta}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Completar Venta"}
      </Button>
    </Box>
  );
};
export default DatosVenta;