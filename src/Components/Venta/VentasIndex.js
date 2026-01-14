import { Box, CircularProgress, Typography, IconButton, Collapse, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { UnfoldLessDouble as UnfoldLessDoubleIcon, UnfoldMoreDouble as UnfoldMoreDoubleIcon } from '@mui/icons-material';
import VentasContent from './VentasContent';
import EmptyState from '../../Shared/Components/EmptyState'
import EventNoteIcon from '@mui/icons-material/EventNote';

const VentasIndex = ({ loadingFechas, showDateLimit, handleToggleDateLimit = () => {}, selectedAnio, setSelectedAnio, selectedMes, setSelectedMes,
  selectedDia, setSelectedDia, selectedFecha, limitAnio, setLimitAnio, limitMes, setLimitMes, limitDia, setLimitDia, fechaLimite, anios = [],
  meses = [], dias = [], loadingVentas, limitMeses=[], limitDias=[] }) => {

  const renderSelect = (label, value, options, onChange, disabled = false, width = '100%') => (
    <FormControl size="small" fullWidth={width === '100%'} sx={{ width }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={options.includes(value) ? value : ''}
        label={label}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {options.length > 0 ? options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>) : <MenuItem disabled>No disponible</MenuItem>}
      </Select>
    </FormControl>
  );

  const minLimitDate = selectedAnio && selectedMes && selectedDia
    ? new Date(selectedAnio, selectedMes - 1, selectedDia)
    : null;

  const filteredAnios = anios.filter(a => !minLimitDate || a >= minLimitDate.getFullYear());
  const filteredMeses = limitMeses.filter(m => !minLimitDate || !limitAnio || new Date(limitAnio, m - 1, 1) >= new Date(minLimitDate.getFullYear(), minLimitDate.getMonth(), 1));
  const filteredDias = limitDias.filter(d => !minLimitDate || !limitAnio || !limitMes || new Date(limitAnio, limitMes - 1, d) > minLimitDate);

  return (
    <Box sx={{ padding: 1, maxWidth: 900, margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Ventas
      </Typography>

      {loadingFechas ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                {renderSelect('Año', selectedAnio, anios, value => { setSelectedAnio(value); setSelectedMes(null); setSelectedDia(null); })}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderSelect('Mes', selectedMes, meses, value => { setSelectedMes(value); setSelectedDia(null); }, !selectedAnio)}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderSelect('Día', selectedDia, dias, setSelectedDia, !selectedMes)}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={2} textAlign="center">
            <IconButton onClick={handleToggleDateLimit}>
              {showDateLimit ? <UnfoldLessDoubleIcon /> : <UnfoldMoreDoubleIcon />}
            </IconButton>
          </Grid>

          <Grid item xs={12} md={5}>
            <Collapse in={showDateLimit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {renderSelect('Año', limitAnio, filteredAnios, value => { setLimitAnio(value); setLimitMes(null); setLimitDia(null); }, false, 90)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderSelect('Mes', limitMes, filteredMeses, value => { setLimitMes(value); setLimitDia(null); }, !limitAnio, 70)}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {renderSelect('Día', limitDia, filteredDias, setLimitDia, !limitMes || filteredDias.length === 0, 70)}
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        </Grid>
      )}

      {selectedFecha ? (
        loadingVentas ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <VentasContent selectedFecha={selectedFecha} fechaLimite={fechaLimite} />
        )
      ) : (
        <EmptyState
          title="Sin registros de ventas"
          message="Actualmente no hay ventas registradas en el sistema."
          Icon={EventNoteIcon}
          minHeight={260}
        />
      )}
    </Box>
  );
};
export default VentasIndex;