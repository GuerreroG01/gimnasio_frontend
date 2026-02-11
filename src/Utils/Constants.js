export const DIAS_SEMANA = [
    { number: 1, name: 'Lunes' },
    { number: 2, name: 'Martes' },
    { number: 3, name: 'Miércoles' },
    { number: 4, name: 'Jueves' },
    { number: 5, name: 'Viernes' },
    { number: 6, name: 'Sábado' },
    { number: 7, name: 'Domingo' },
];

export const getNombreDia = (numero) =>
    DIAS_SEMANA.find((d) => d.number === numero)?.name || '';

export const getNumeroDia = (nombre) =>
    DIAS_SEMANA.find((d) => d.name === nombre)?.number || null;