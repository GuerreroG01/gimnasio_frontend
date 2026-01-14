import {
    Box, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress, Pagination, IconButton, Grid
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import FiltroPagos from './FiltroPagos';
import PagosCards from './PagosCards';
import PagosResumen from './PagosResumen';

const PagosIndex = ({ nombreCliente, setNombreCliente, year, month, day, months, handleDayChange, handleMonthChange, handleYearChange,
    availableDays, availableMonths, availableYears, loadingSelectors, pagosDayData, loading, error, page, handlePageChange, currentPagos,
    handlePagoDeleted, filteredPagos }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '90%', margin: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Pagos Registrados
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} sx={{ mt: { xs: -1, sm: -2, md: -2 } }}>
                    <FiltroPagos nombreCliente={nombreCliente} setNombreCliente={setNombreCliente} />
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel sx={{ color: '#333' }}>Año</InputLabel>
                                <Select
                                    value={year || ''}
                                    label="Año"
                                    onChange={handleYearChange}
                                    sx={{ fontSize: '0.9rem' }}
                                >
                                    {availableYears.length > 0 ? (
                                        availableYears.map((yearOption) => (
                                            <MenuItem key={yearOption} value={yearOption}>
                                                {yearOption}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No hay años disponibles</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel sx={{ color: '#333' }}>Mes</InputLabel>
                                <Select
                                    value={month || ''}
                                    label="Mes"
                                    onChange={handleMonthChange}
                                    sx={{ fontSize: '0.9rem' }}
                                >
                                    {availableMonths.length > 0 ? (
                                        availableMonths.map((monthOption) => (
                                            <MenuItem key={monthOption} value={monthOption}>
                                                {months.find(m => m.number === monthOption)?.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No hay meses disponibles</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl sx={{ width: '100%', position: 'relative' }}>
                                <InputLabel sx={{ color: '#333' }}>Día</InputLabel>
                                <Select
                                    value={day || ''}
                                    label="Día"
                                    onChange={handleDayChange}
                                    disabled={loadingSelectors}
                                    sx={{ fontSize: '0.9rem' }}
                                >
                                    {availableDays.length > 0 ? (
                                        availableDays.map((dayOption) => (
                                            <MenuItem key={dayOption} value={dayOption}>
                                                {dayOption}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No hay días disponibles</MenuItem>
                                    )}
                                </Select>
                                {loadingSelectors && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        marginTop: { xs: 2, sm: -6, md: -8 },
                        marginBottom: 0,
                        marginLeft: { xs: 0, sm: 'auto' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 2, sm: 6 }
                    }}
                >
                    <PagosResumen 
                        diaseleccionado={day} 
                        pagosDayData={pagosDayData} 
                        sx={{ width: { xs: '100%', sm: 'auto' } }} 
                    />
                    <IconButton
                        color="primary"
                        onClick={() => navigate('/pagos/form')}
                        sx={{
                            fontSize: 30,
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': { backgroundColor: '#1565c0' },
                            padding: 1,
                            alignSelf: { xs: 'flex-end', sm: 'center' }
                        }}
                    >
                        <AddCircleIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" variant="body1" sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}

            <PagosCards pagos={currentPagos} onPagoDeleted={handlePagoDeleted} />

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                    count={Math.ceil(filteredPagos.length / 12)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            </Box>
        </Box>
    );
};

export default PagosIndex;
