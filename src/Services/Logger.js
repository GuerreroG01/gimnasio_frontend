const isDev = process.env.NODE_ENV === 'development';

const Logger = {
    log: (...args) => {
        if (isDev) console.log(...args);
    },
    info: (...args) => {
        if (isDev) console.info(...args);
    },
    debug: (...args) => {
        if (isDev) console.debug(...args);
    },
    error: (...args) => console.error(...args),
};

export default Logger;