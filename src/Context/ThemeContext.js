import React, { createContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = React.useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prev => !prev);

    const theme = useMemo(() => createTheme(getDesignTokens(darkMode ? 'dark' : 'light')), [darkMode]);

    useEffect(() => {
        if (darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        } else {
        document.body.removeAttribute('data-theme');
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <MuiThemeProvider theme={theme}>
            {children}
        </MuiThemeProvider>
        </ThemeContext.Provider>
    );
    };

    export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
        ? {
            background: {
                default: '#ffffff',
                paper: '#f5f5f5',
            },
            text: {
                primary: '#000000',
            },
            }
        : {
            background: {
                default: '#121212',
                paper: '#1d1d1d',
            },
            text: {
                primary: '#ffffff',
            },
            }),
    },
});