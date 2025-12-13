import React, { useEffect } from 'react';
import IndexPago from "../../Components/Pago/PagosIndex";
import pagoService from '../../Services/PagoService';

export default function IndexPage(){
    const [year, setYear] = React.useState(null);
    const [month, setMonth] = React.useState(null);
    const [day, setDay] = React.useState(null);
    const [pagos, setPagos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [availableYears, setAvailableYears] = React.useState([]);
    const [availableMonths, setAvailableMonths] = React.useState([]);
    const [availableDays, setAvailableDays] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [nombreCliente, setNombreCliente] = React.useState('');
    const [loadingSelectors, setLoadingSelectors] = React.useState(false);
    const [pagosDayData, setPagosDay] = React.useState([]);

    const months = [
        { number: 1, name: 'Enero' },
        { number: 2, name: 'Febrero' },
        { number: 3, name: 'Marzo' },
        { number: 4, name: 'Abril' },
        { number: 5, name: 'Mayo' },
        { number: 6, name: 'Junio' },
        { number: 7, name: 'Julio' },
        { number: 8, name: 'Agosto' },
        { number: 9, name: 'Septiembre' },
        { number: 10, name: 'Octubre' },
        { number: 11, name: 'Noviembre' },
        { number: 12, name: 'Diciembre' }
    ];
    const handleYearChange = (event) => {
        const selectedYear = event.target.value;
        setYear(selectedYear);
        setLoadingSelectors(true);

        const fetchMonths = async () => {
            try {
                const response = await pagoService.getMesesConPagos(selectedYear);
                const monthsData = response;
                setAvailableMonths(monthsData.map(month => month.mes));

                const lastMonth = monthsData.length > 0 ? monthsData[monthsData.length - 1].mes : null;
                setMonth(lastMonth);

                if (lastMonth) {
                    const fetchDays = async () => {
                        try {
                            const responseDays = await pagoService.getDiasConPagos(selectedYear, lastMonth);
                            const daysData = responseDays;
                            setPagosDay(daysData);
                            setAvailableDays(daysData.map(day => day.dia));
                            setDay(daysData.length > 0 ? daysData[daysData.length - 1].dia : null);
                        } catch (err) {
                            setError('Error al obtener los días de pagos');
                        } finally {
                            setLoadingSelectors(false);
                        }
                    };
                    fetchDays();
                }
            } catch (err) {
                setError('Error al obtener los meses de pagos');
                setLoadingSelectors(false);
            }
        };

        fetchMonths();
    };

    const handleMonthChange = (event) => {
        const selectedMonth = event.target.value;
        setMonth(selectedMonth);
        setLoadingSelectors(true);

        const fetchDays = async () => {
            try {
                const response = await pagoService.getDiasConPagos(year, selectedMonth);
                const daysData = response;
                setPagosDay(daysData);
                setAvailableDays(daysData.map(day => day.dia));
                setDay(daysData.length > 0 ? daysData[daysData.length - 1].dia : null);
            } catch (err) {
                setError('Error al obtener los días de pagos');
            } finally {
                setLoadingSelectors(false);
            }
        };

        fetchDays();
    };

    const handleDayChange = (event) => {
        const selectedDay = event.target.value;
        setDay(selectedDay);
    };

    useEffect(() => {
        const fetchPagos = async () => {
            if (year && month && day && !loadingSelectors) {
                setLoading(true);
                setError(null);

                try {
                    const data = await pagoService.getPagosByMonthAndYear(year, month, day);
                    console.log('Dato recibido en el componente:', data);
                    setPagos(data);
                } catch (err) {
                    setError('Hubo un problema al obtener los pagos.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPagos();
    }, [year, month, day, loadingSelectors]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchResumenPagos = async () => {
            try {
                const response = await pagoService.getAñosConPagos();
                const yearsData = response;
                setAvailableYears(yearsData.map(year => year.año));

                const defaultYear = yearsData.length > 0 ? yearsData[yearsData.length - 1].año : null;
                setYear(defaultYear);

                if (defaultYear) {
                    const responseMonths = await pagoService.getMesesConPagos(defaultYear);
                    const monthsData = responseMonths;
                    setAvailableMonths(monthsData.map(month => month.mes));

                    const lastMonth = monthsData.length > 0 ? monthsData[monthsData.length - 1].mes : null;
                    setMonth(lastMonth);

                    if (lastMonth) {
                        const responseDays = await pagoService.getDiasConPagos(defaultYear, lastMonth);
                        const daysData = responseDays;
                        setPagosDay(daysData);
                        setAvailableDays(daysData.map(day => day.dia));
                        const lastDay = daysData.length > 0 ? daysData[daysData.length - 1].dia : null;
                        setDay(lastDay);
                    }
                }
            } catch (err) {
                setError('Error al obtener resumen de pagos');
                console.error('Error al obtener resumen de pagos:', err);
            }
        };

        fetchResumenPagos();
    }, []);

    const filteredPagos = pagos.filter(pago =>
        pago.cliente && pago.cliente.nombreCompleto.toLowerCase().includes(nombreCliente.toLowerCase())
    );

    const indexOfLastPago = page * 12;
    const indexOfFirstPago = indexOfLastPago - 12;
    const currentPagos = filteredPagos.slice(indexOfFirstPago, indexOfLastPago);

    const handlePagoDeleted = (deletedPagoId) => {
        setPagos(prevPagos => prevPagos.filter(pago => pago.codigoPago !== deletedPagoId));
    };

    return(
        <IndexPago
            nombreCliente={nombreCliente} setNombreCliente={setNombreCliente}
            year={year} month={month} day={day} months={months}
            handleDayChange={handleDayChange} handleMonthChange={handleMonthChange} handleYearChange={handleYearChange}
            availableYears={availableYears} availableMonths={availableMonths} availableDays={availableDays}
            loadingSelectors={loadingSelectors}
            pagosDayData={pagosDayData}
            loading={loading} error={error} page={page} handlePageChange={handlePageChange}
            currentPagos={currentPagos}
            handlePagoDeleted={handlePagoDeleted} filteredPagos={filteredPagos}
        />
    );
}