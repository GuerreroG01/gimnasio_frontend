import { 
  Box, Typography, MenuItem, Select, FormControl, InputLabel, Paper, IconButton, Zoom 
} from '@mui/material';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';
import AsistenciaContent from './AsistenciaContent';
import EmptyState from '../../Shared/Components/EmptyState';
import EventNoteIcon from '@mui/icons-material/EventNote';

const AsistenciaListado = ({ availableYears, year, setYear, availableMonths, month, setMonth, availableDays, day, setDay,
  handleToggleDateLimit, showDateLimit, availableMonthsLimit, monthLimit, setMonthLimit, availableDaysLimit, dayLimit, setDayLimit, 
  yearLimit, setYearLimit, months }) => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2', textAlign: 'center' }}>
        Registro de Asistencia
      </Typography>

      <Paper sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <FormControl variant="standard" sx={{ minWidth: 150 }}>
          <InputLabel>Año</InputLabel>
          <Select value={year || ''} onChange={(e) => setYear(e.target.value)}>
            {availableYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 150 }} disabled={!year}>
          <InputLabel>Mes</InputLabel>
          <Select value={month || ''} onChange={(e) => setMonth(e.target.value)}>
            {availableMonths.map(m => (
              <MenuItem key={m} value={m}>
                {months.find(mo => mo.number === m)?.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ minWidth: 150 }} disabled={!month}>
          <InputLabel>Día</InputLabel>
          <Select value={day || ''} onChange={(e) => setDay(e.target.value)}>
            {availableDays.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <IconButton onClick={handleToggleDateLimit} sx={{transition: "transform 0.3s ease", transform: "rotate(90deg)"}}>
          {showDateLimit ? <UnfoldLessDoubleIcon /> : <UnfoldMoreDoubleIcon />}
        </IconButton>

        <Zoom in={showDateLimit} style={{ transitionDelay: showDateLimit ? '200ms' : '0ms' }}>
          <FormControl variant="standard" sx={{ minWidth: 150 }}>
            <InputLabel>Año Límite</InputLabel>
            <Select value={yearLimit || ''} onChange={(e) => setYearLimit(e.target.value)}>
              {availableYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>
        </Zoom>

        <Zoom in={showDateLimit} style={{ transitionDelay: showDateLimit ? '400ms' : '0ms' }}>
          <FormControl variant="standard" sx={{ minWidth: 150 }} disabled={!yearLimit}>
            <InputLabel>Mes Límite</InputLabel>
            <Select value={monthLimit || ''} onChange={(e) => setMonthLimit(e.target.value)}>
              {availableMonthsLimit.map(m => (
                <MenuItem key={m} value={m}>
                  {months.find(mo => mo.number === m)?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Zoom>

        <Zoom in={showDateLimit} style={{ transitionDelay: showDateLimit ? '600ms' : '0ms' }}>
          <FormControl variant="standard" sx={{ minWidth: 150 }} disabled={!monthLimit}>
            <InputLabel>Día Límite</InputLabel>
            <Select value={dayLimit || ''} onChange={(e) => setDayLimit(e.target.value)}>
              {availableDaysLimit.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
        </Zoom>
      </Paper>
      {year && month && day ? (
        <AsistenciaContent 
          year={year} 
          month={month} 
          day={day} 
          yearLimit={yearLimit} 
          monthLimit={monthLimit} 
          dayLimit={dayLimit} 
          showDateLimit={showDateLimit} 
        />
      ) : (
        <EmptyState
          title="Sin registros de asistencia"
          message="Actualmente no hay asistencias registradas en el sistema."
          Icon={EventNoteIcon}
          minHeight={260}
        />
      )}
    </Box>
  );
};
export default AsistenciaListado;