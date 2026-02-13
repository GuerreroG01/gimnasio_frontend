import { Grid, Card, CardContent, TextField, FormControlLabel, Checkbox, Box, MenuItem, Tooltip } from "@mui/material"; 
import InputAdornment from '@mui/material/InputAdornment';
import HelpOutline from '@mui/icons-material/HelpOutline';

export default function Step1DatosPrograma({ form, handleChange, dia}) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Grid container spacing={2} sx={{ maxWidth: 1300 }}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                        <TextField
                            name="titulo"
                            label="Título del programa"
                            value={form.titulo}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Nivel"
                                    fullWidth
                                    variant="outlined"
                                    value={form.nivel || ""}
                                    onChange={(e) =>
                                        handleChange({ target: { name: "nivel", value: e.target.value } })
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip title="Fija el orden del nivel. Ej: Principiante = 1, Intermedio = 2, etc.">
                                                    <TextField
                                                        type="number"
                                                        variant="standard"
                                                        value={form.ordenNivel}
                                                        onChange={(e) =>
                                                            handleChange({
                                                                target: {
                                                                    name: "ordenNivel",
                                                                    value: Number(e.target.value),
                                                                },
                                                            })
                                                        }
                                                        slotProps={{
                                                            input: {
                                                                style: { width: 40, textAlign: "center", cursor: "pointer" },
                                                                min: 1,
                                                            },
                                                        }}
                                                    />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tipo"
                                    fullWidth
                                    variant="outlined"
                                    value={form.tipo || ""}
                                    onChange={(e) =>
                                    handleChange({ target: { name: "tipo", value: e.target.value } })
                                    }
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip title="Selecciona género para adecuar el plan de entrenamiento correcto">
                                                        <TextField
                                                            select
                                                            variant="standard"
                                                            value={form.generoDedicado || ""}
                                                            onChange={(e) =>
                                                                handleChange({ target: { name: "generoDedicado", value: e.target.value } })
                                                            }
                                                            slotProps={{
                                                                htmlInput: {
                                                                    style: { width: 80, textAlign: "center", cursor: "pointer" },
                                                                },
                                                            }}
                                                        >
                                                            <MenuItem value="">--</MenuItem>
                                                            <MenuItem value="M">M</MenuItem>
                                                            <MenuItem value="F">F</MenuItem>
                                                        </TextField>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                </Grid>
                        </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* COLUMNA DERECHA */}
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            name="duracion"
                                            label="Duración"
                                            value={form.duracion}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="outlined"
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            días
                                                        </InputAdornment>
                                                    ),
                                                    inputProps: { min: 1 },
                                                },
                                            }}
                                            helperText="Duración en días"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item xs={4}>
                                    <Tooltip
                                        title={
                                            "Indica el orden en que lleva este programa. " +
                                            "Si hay más de un programa para el mismo día, " +
                                            "el orden va determinar por cual iniciará el cliente"
                                        }
                                        arrow
                                        placement="top"
                                    >
                                        <TextField
                                            type="number"
                                            name="orden"
                                            label="Orden"
                                            value={form.orden}
                                            onChange={handleChange}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    inputProps: { min: 1 },
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <HelpOutline fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                        />
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField
                                        select
                                        name="dia"
                                        label="Día"
                                        value={form.dia}
                                        onChange={handleChange}
                                        fullWidth
                                    >
                                        {dia.map((d) => (
                                            <MenuItem key={d.number} value={d.number}>
                                                {d.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>

                            <TextField
                                name="contenido"
                                label="Contenido / Alimentación Sugerida"
                                value={form.contenido}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                fullWidth
                                sx={{ mt: 2 }}
                            />

                        <FormControlLabel
                                sx={{ mt: 1 }}
                                control={
                                    <Checkbox
                                        name="activo"
                                        checked={form.activo}
                                        onChange={handleChange}
                                    />
                                }
                                label={form.activo ? 'Programa activo' : 'Programa inactivo'}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
