import {
    Box, Typography, MenuItem, Select, InputLabel, FormControl, CircularProgress, Pagination, IconButton, Grid, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import FiltroPagos from './FiltroPagos';
import PagosCards from './PagosCards';
import PagosResumen from './PagosResumen';
import EmptyState from '../../Shared/Components/EmptyState';
import PaymentIcon from '@mui/icons-material/Payment';
import CustomSnackbar from '../../Shared/Components/CustomSnackbar';

const PagosIndex = ({ nombreCliente, setNombreCliente, year, month, day, months, handleDayChange, handleMonthChange, handleYearChange,
    availableDays, availableMonths, availableYears, loadingSelectors, pagosDayData, loading, page, handlePageChange, currentPagos,
    handlePagoDeleted, filteredPagos, snackbar, handleCloseSnackbar }) => {
    const navigate = useNavigate();
    return (
        <Box sx={{ width: '100%', margin: 'auto' }}>
            <Grid
                container
                sx={{
                    mt: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    gap: 2
                }}
            >
                <Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: '#1976d2'
                            }}
                        >
                            Pagos Registrados
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 1, maxWidth: 400 }}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Año</InputLabel>
                                <Select
                                    value={year || ''}
                                    label="Año"
                                    onChange={handleYearChange}
                                >
                                    {availableYears.map((yearOption) => (
                                        <MenuItem key={yearOption} value={yearOption}>
                                            {yearOption}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Mes</InputLabel>
                                <Select
                                    value={month || ''}
                                    label="Mes"
                                    onChange={handleMonthChange}
                                >
                                    {availableMonths.map((monthOption) => (
                                        <MenuItem key={monthOption} value={monthOption}>
                                            {months.find(m => m.number === monthOption)?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <FormControl
                                    sx={{
                                        flex: 1,
                                        position: 'relative'
                                    }}
                                >
                                    <InputLabel>Día</InputLabel>
                                    <Select
                                        value={day || ''}
                                        label="Día"
                                        onChange={handleDayChange}
                                        disabled={loadingSelectors}
                                    >
                                        {availableDays.map((dayOption) => (
                                            <MenuItem key={dayOption} value={dayOption}>
                                                {dayOption}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {loadingSelectors && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        />
                                    )}
                                </FormControl>

                                <IconButton
                                    color="primary"
                                    onClick={() => navigate('/pagos/form')}
                                    sx={{
                                        flexShrink: 0,
                                        display: { xs: 'flex', sm: 'none' }
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <FiltroPagos
                        nombreCliente={nombreCliente}
                        setNombreCliente={setNombreCliente}
                    />
                    <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <PagosResumen
                            diaseleccionado={day}
                            pagosDayData={pagosDayData}
                        />
                        <IconButton
                            color="primary"
                            onClick={() => navigate('/pagos/form')}
                            sx={{
                            display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Grid>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && currentPagos.length === 0 ? (
            <Box
                sx={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <EmptyState
                    title="No hay pagos encontrados"
                    message="Sin pagos registrados para esta fecha."
                    Icon={PaymentIcon}
                />
            </Box>
            ) : (
                <PagosCards pagos={currentPagos} onPagoDeleted={handlePagoDeleted} />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                    count={Math.ceil(filteredPagos.length / 10)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                />
            </Box>
            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </Box>
    );
};
export default PagosIndex;