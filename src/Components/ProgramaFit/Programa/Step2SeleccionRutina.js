import React, { useEffect } from "react";
import { Grid, Card, CardContent, Typography, Autocomplete, TextField, Box, CircularProgress, Divider,
  IconButton, Container, Pagination } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ProgramaFitService from "../../../Services/ProgramaFitService";

export default function Step2SeleccionRutina({ rutinasSeleccionadas, setRutinasSeleccionadas }) {
  const [opcionesRutinas, setOpcionesRutinas] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = React.useState(1);

  const totalPages = Math.ceil(rutinasSeleccionadas.length / ITEMS_PER_PAGE);

  const rutinasPaginadas = rutinasSeleccionadas.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  useEffect(() => {
    const nuevasPaginas = Math.ceil(
      rutinasSeleccionadas.length / ITEMS_PER_PAGE
    );

    if (page > nuevasPaginas && nuevasPaginas > 0) {
      setPage(nuevasPaginas);
    }

    if (nuevasPaginas === 0 && page !== 1) {
      setPage(1);
    }
  }, [rutinasSeleccionadas, page]);

  const handleRemoveRutina = (id) => {
    setRutinasSeleccionadas(prev => prev.filter(r => r.id !== id));
  };

  const handleRutinaChange = (event, newValue) => {
      const nuevasRutinas = newValue.filter(
          r => !rutinasSeleccionadas.some(rs => rs.id === r.id)
      );
      setRutinasSeleccionadas(prev => [...prev, ...nuevasRutinas]);
  };


  useEffect(() => {
    if (!inputValue) {
      setOpcionesRutinas([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timeoutId = setTimeout(async () => {
      try {
        const ejercicios = inputValue
          .split(",")
          .map(e => e.trim())
          .filter(Boolean);

        const resultados =
          await ProgramaFitService.getRutinasByEjercicios(ejercicios);

        if (active) {
          setOpcionesRutinas(resultados);
        }
      } catch (error) {
        console.error("Error buscando rutinas:", error);
      } finally {
        if (active) setLoading(false);
      }
    }, 900);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={4}
        sx={{ flexDirection: { xs: "column", md: "row" } }}
        alignItems="stretch"
        justifyContent="space-between"
      >
        {/* ================== IZQUIERDA ================== */}
        <Grid item xs={12} md="auto" sx={{   flexBasis: { md: "35%" },   width: { xs: "100%", md: "35%" }}}>
          <Card sx={{ height: 130, display: "flex", flexDirection: "column" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Buscar rutinas
              </Typography>

              <Autocomplete
                multiple
                options={opcionesRutinas}
                getOptionLabel={(option) => option.ejercicio}
                filterSelectedOptions
                loading={loading}
                noOptionsText="No hay resultados"
                onChange={handleRutinaChange}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                renderValue={() => null}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.ejercicio}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Rutinas"
                    variant="outlined"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ================== DERECHA ================== */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            flexBasis: { md: "60%" },
            width: { xs: "100%", md: "60%" },
          }}
        >
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rutinas seleccionadas
              </Typography>

              {rutinasSeleccionadas.length === 0 ? (
                <Typography color="text.secondary">
                  Aún no has agregado rutinas al programa
                </Typography>
              ) : (
                <Box>
                  {rutinasPaginadas.map((r) => (
                    <Box key={r.id}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body1">{r.ejercicio}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.series} x {r.repeticiones} · Descanso {r.descanso}
                          </Typography>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveRutina(r.id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>

                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}

                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}