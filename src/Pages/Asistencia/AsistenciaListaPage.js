import React, { useEffect, useReducer, useRef } from 'react';
import AsistenciaService from '../../Services/AsistenciaService';
import AsistenciaListado from '../../Components/Asistencia/AsistenciaListado';


const initialState = {
    year: null,
    month: null,
    day: null,
    availableYears: [],
    availableMonths: [],
    availableDays: [],

    yearLimit: null,
    monthLimit: null,
    dayLimit: null,
    availableMonthsLimit: [],
    availableDaysLimit: [],

    showDateLimit: false,
};

function reducer(state, action) {
    switch (action.type) {

        case 'SET_YEARS':
            return {
                ...state,
                availableYears: action.payload,
                year: action.payload.at(-1) ?? null,
            };

        case 'SET_YEAR':
            return {
                ...state,
                year: action.payload,
                month: null,
                day: null,
                availableMonths: [],
                availableDays: [],
            };

        case 'SET_MONTHS':
            return {
                ...state,
                availableMonths: action.payload,
                month: action.payload.at(-1) ?? null,
            };

        case 'SET_MONTH':
            return {
                ...state,
                month: action.payload,
                day: null,
                availableDays: [],
            };

        case 'SET_DAYS':
            return {
                ...state,
                availableDays: action.payload,
                day: action.payload.at(-1) ?? null,
            };

        case 'SET_DAY':
            return { ...state, day: action.payload };

        case 'SET_YEAR_LIMIT':
            return {
                ...state,
                yearLimit: action.payload,
                monthLimit: null,
                dayLimit: null,
                availableMonthsLimit: [],
                availableDaysLimit: [],
            };

        case 'SET_MONTHS_LIMIT':
            return {
                ...state,
                availableMonthsLimit: action.payload,
                monthLimit: action.payload.at(-1) ?? null,
            };

        case 'SET_MONTH_LIMIT':
            return {
                ...state,
                monthLimit: action.payload,
                dayLimit: null,
                availableDaysLimit: [],
            };

        case 'SET_DAYS_LIMIT':
            return {
                ...state,
                availableDaysLimit: action.payload,
                dayLimit: action.payload.at(-1) ?? null,
            };

        case 'SET_DAY_LIMIT':
            return { ...state, dayLimit: action.payload };

        case 'TOGGLE_LIMIT':
            return {
                ...state,
                showDateLimit: !state.showDateLimit,
                ...(state.showDateLimit && {
                    yearLimit: null,
                    monthLimit: null,
                    dayLimit: null,
                    availableMonthsLimit: [],
                    availableDaysLimit: [],
                }),
            };

        default:
            return state;
    }
}

export default function AsistenciaListaPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const requestStartRef = useRef(0);
    const requestLimitRef = useRef(0);

    const months = [
        { number: 1, name: 'Enero' }, { number: 2, name: 'Febrero' },
        { number: 3, name: 'Marzo' }, { number: 4, name: 'Abril' },
        { number: 5, name: 'Mayo' }, { number: 6, name: 'Junio' },
        { number: 7, name: 'Julio' }, { number: 8, name: 'Agosto' },
        { number: 9, name: 'Septiembre' }, { number: 10, name: 'Octubre' },
        { number: 11, name: 'Noviembre' }, { number: 12, name: 'Diciembre' },
    ];


    useEffect(() => {
        const fetchYears = async () => {
            const res = await AsistenciaService.getAñosConAsistencia();
            dispatch({ type: 'SET_YEARS', payload: res.map(y => y.año) });
        };
        fetchYears();
    }, []);

    useEffect(() => {
        if (!state.year) return;

        const id = ++requestStartRef.current;

        const fetchMonths = async () => {
            const res = await AsistenciaService.getMesesConAsistencia(state.year);
            if (id === requestStartRef.current) {
                dispatch({ type: 'SET_MONTHS', payload: res.map(m => m.mes) });
            }
        };

        fetchMonths();
    }, [state.year]);

    useEffect(() => {
        if (!state.year || !state.month) return;

        const id = ++requestStartRef.current;

        const fetchDays = async () => {
            const res = await AsistenciaService.getDiasConAsistencia(state.year, state.month);
            if (id === requestStartRef.current) {
                dispatch({ type: 'SET_DAYS', payload: res.map(d => d.dia) });
            }
        };

        fetchDays();
    }, [state.year, state.month]);

    useEffect(() => {
        if (!state.yearLimit) return;

        const id = ++requestLimitRef.current;

        const fetchMonthsLimit = async () => {
            const res = await AsistenciaService.getMesesConAsistencia(state.yearLimit);
            if (id === requestLimitRef.current) {
                dispatch({ type: 'SET_MONTHS_LIMIT', payload: res.map(m => m.mes) });
            }
        };

        fetchMonthsLimit();
    }, [state.yearLimit]);

    useEffect(() => {
        if (!state.yearLimit || !state.monthLimit) return;

        const id = ++requestLimitRef.current;

        const fetchDaysLimit = async () => {
            const res = await AsistenciaService.getDiasConAsistencia(
                state.yearLimit,
                state.monthLimit
            );
            if (id === requestLimitRef.current) {
                dispatch({ type: 'SET_DAYS_LIMIT', payload: res.map(d => d.dia) });
            }
        };

        fetchDaysLimit();
    }, [state.yearLimit, state.monthLimit]);

    return (
        <AsistenciaListado
            availableYears={state.availableYears}
            year={state.year}
            setYear={y => dispatch({ type: 'SET_YEAR', payload: y })}

            availableMonths={state.availableMonths}
            month={state.month}
            setMonth={m => dispatch({ type: 'SET_MONTH', payload: m })}

            availableDays={state.availableDays}
            day={state.day}
            setDay={d => dispatch({ type: 'SET_DAY', payload: d })}

            showDateLimit={state.showDateLimit}
            handleToggleDateLimit={() => dispatch({ type: 'TOGGLE_LIMIT' })}

            yearLimit={state.yearLimit}
            setYearLimit={y => dispatch({ type: 'SET_YEAR_LIMIT', payload: y })}

            availableMonthsLimit={state.availableMonthsLimit}
            monthLimit={state.monthLimit}
            setMonthLimit={m => dispatch({ type: 'SET_MONTH_LIMIT', payload: m })}

            availableDaysLimit={state.availableDaysLimit}
            dayLimit={state.dayLimit}
            setDayLimit={d => dispatch({ type: 'SET_DAY_LIMIT', payload: d })}

            months={months}
        />
    );
}