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
        return '';
    }
};

export const obtenerMonedaEquivalente = (moneda) => {
    return moneda === 'NIO' ? 'USD' : 'NIO';
};