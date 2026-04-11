export const convertirPrecio = ( precio, monedaOrigen, monedaDestino, tipoCambio ) => {
    if (!tipoCambio) return precio;
    if (monedaOrigen === monedaDestino) return precio;

    const tasaObj = tipoCambio.find(
        t =>
        t.monedaOrigen === monedaOrigen &&
        t.monedaDestino === monedaDestino
    );

    if (!tasaObj) return precio;

    return precio * tasaObj.tasa;
};

export const obtenerSimboloMoneda = (moneda) => {
    switch (moneda) {
        case 'NIO':
            return 'C$';
        case 'USD':
            return '$';
        default:
            return moneda;
    }
};

export const obtenerMonedaEquivalente = (moneda, tipoCambio) => {
    if (!moneda || !Array.isArray(tipoCambio) || tipoCambio.length === 0) {
        return null;
    }

    const cambio = tipoCambio.find(
        t => t.monedaOrigen === moneda || t.monedaDestino === moneda
    );

    if (!cambio) return null;

    return cambio.monedaOrigen === moneda
        ? cambio.monedaDestino
        : cambio.monedaOrigen;
};