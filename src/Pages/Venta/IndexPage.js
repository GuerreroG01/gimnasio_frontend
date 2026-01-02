import React, { useState, useEffect } from "react";
import VentasIndex from "../../Components/Venta/VentasIndex";
import VentaService from "../../Services/VentaService";

export default function IndexPage() {
  const [fechaLimite, setFechaLimite] = useState(null);
  const [loadingFechas, setLoadingFechas] = useState(true);
  const [showDateLimit, setShowDateLimit] = useState(false);
  const [selectedFecha, setSelectedFecha] = useState(null);

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [day, setDay] = useState(null);

  const [limitYear, setLimitYear] = useState(null);
  const [limitMonth, setLimitMonth] = useState(null);
  const [limitDay, setLimitDay] = useState(null);

  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableLimitMonths, setAvailableLimitMonths] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableLimitDays, setAvailableLimitDays] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await VentaService.GetAniosConVentas();
        const years = Array.isArray(response) ? response.map(Number) : [];
        setAvailableYears(years);
        if (years.length) setYear(years.at(-1));
      } catch (err) {
        console.error("Error al obtener años", err);
      } finally {
        setLoadingFechas(false);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    if (!year) return;

    const fetchMonths = async () => {
      try {
        const response = await VentaService.GetMesesConVentas(year);
        const months = Array.isArray(response) ? response.map(Number) : [];
        setAvailableMonths(months);
        if (months.length) setMonth(months.at(-1));
      } catch (err) {
        console.error("Error al obtener meses", err);
      }
    };
    fetchMonths();
  }, [year]);

  useEffect(() => {
    if (!year || !month) return;

    const fetchDays = async () => {
      try {
        const response = await VentaService.GetDiasConVentas(year, month);
        const days = Array.isArray(response) ? response.map(Number) : [];
        setAvailableDays(days);
        if (days.length) setDay(days.at(-1));
      } catch (err) {
        console.error("Error al obtener días", err);
      }
    };
    fetchDays();
  }, [year, month]);
  
  useEffect(() => {
    if (!limitYear) return;

    const fetchLimitMonths = async () => {
      try {
        const response = await VentaService.GetMesesConVentas(limitYear);
        const months = Array.isArray(response) ? response.map(Number) : [];
        setAvailableLimitMonths(months);
        setLimitMonth(months.length ? months.at(-1) : null);
        if (months.length) setLimitMonth(months.at(-1));
      } catch (err) {
        console.error("Error al obtener meses límite", err);
      }
    };

    fetchLimitMonths();
  }, [limitYear]);

  useEffect(() => {
    if (!limitYear || !limitMonth) return;

    const fetchLimitDays = async () => {
      try {
        const response = await VentaService.GetDiasConVentas(limitYear, limitMonth);
        const days = Array.isArray(response) ? response.map(Number) : [];
        setAvailableLimitDays(days);
        if (days.length) setLimitDay(days.at(-1));
      } catch (err) {
        console.error("Error al obtener días límite", err);
      }
    };

    fetchLimitDays();
  }, [limitYear, limitMonth]);

  useEffect(() => {
    if ([year, month, day].some(v => !Number.isInteger(v))) return;
    if (!availableDays.includes(day)) return;

    const fecha = new Date(year, month - 1, day);
    if (!isNaN(fecha.getTime())) setSelectedFecha(fecha.toISOString());
  }, [year, month, day, availableDays]);

  useEffect(() => {
    if (![limitYear, limitMonth, limitDay].every(Number.isInteger)) return;
    const fecha = new Date(limitYear, limitMonth - 1, limitDay);
    if (!isNaN(fecha.getTime())) setFechaLimite(fecha.toISOString());
  }, [limitYear, limitMonth, limitDay]);

  const handleToggleDateLimit = () => {
    setShowDateLimit(prev => {
      const next = !prev;
      if (!next) {
        setFechaLimite(null);
        setLimitYear(null);
        setLimitMonth(null);
        setLimitDay(null);
      }
      return next;
    });
  };

  return (
    <VentasIndex
      loadingFechas={loadingFechas}
      showDateLimit={showDateLimit}
      handleToggleDateLimit={handleToggleDateLimit}
      selectedFecha={selectedFecha}
      setSelectedFecha={setSelectedFecha}
      selectedAnio={year}
      setSelectedAnio={v => setYear(Number(v))}
      selectedMes={availableMonths.includes(month) ? month : ""}
      setSelectedMes={v => setMonth(Number(v))}
      selectedDia={availableDays.includes(day) ? day : ""}
      setSelectedDia={v => setDay(Number(v))}
      limitAnio={limitYear}
      setLimitAnio={v => setLimitYear(Number(v))}
      limitMes={limitMonth}
      setLimitMes={v => setLimitMonth(Number(v))}
      limitDia={limitDay}
      setLimitDia={v => setLimitDay(Number(v))}
      fechaLimite={fechaLimite}
      anios={availableYears}
      meses={availableMonths}
      dias={availableDays}
      limitMeses={availableLimitMonths}
      limitDias={availableLimitDays}
    />
  );
}