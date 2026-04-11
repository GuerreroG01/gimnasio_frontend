import React, { useMemo, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, useTheme, Snackbar, Alert } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const rowsPerPageDefault = 5;

const GananciasTable = ({ pagosData }) => {
    const [page, setPage] = React.useState(0);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    useEffect(() => {
        if (!pagosData || pagosData.length === 0) {
            setOpenSnackbar(true);
        }
    }, [pagosData]);

    const dataNormalizada = useMemo(() => {
        if (!pagosData || pagosData.length === 0) {
            return [];
        }

        const sorted = [...pagosData].sort((a, b) => b.año - a.año);

        return sorted.map((item, index, array) => {
            const prev = array[index + 1] || null;

            const totalActual = Object.values(item.totalesPorMoneda || {})
                .reduce((acc, val) => acc + val, 0);

            const totalPrev = prev
                ? Object.values(prev.totalesPorMoneda || {})
                    .reduce((acc, val) => acc + val, 0)
                : null;

            const trend =
                prev && totalPrev !== null
                    ? totalActual > totalPrev
                        ? { Icon: TrendingUpIcon, color: "#43A047" }
                        : totalActual < totalPrev
                            ? { Icon: TrendingDownIcon, color: "#E53935" }
                            : { Icon: TrendingFlatIcon, color: "#757575" }
                    : { Icon: TrendingFlatIcon, color: "#757575" };

            return {
                año: item.año,
                monedas: item.totalesPorMoneda || {},
                trend
            };
        });
    }, [pagosData]);

    // 🔹 monedas dinámicas
    const monedas = useMemo(() => {
        if (!dataNormalizada.length) return [];

        return Array.from(
            new Set(
                dataNormalizada.flatMap((item) =>
                    Object.keys(item.monedas || {})
                )
            )
        );
    }, [dataNormalizada]);

    const handleChangePage = (event, newPage) => setPage(newPage);

    return (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
            <TableContainer
                component={Paper}
                sx={{
                    maxWidth: 900,
                    backgroundColor: isDarkMode
                        ? theme.palette.background.default
                        : "#fff",
                    boxShadow: 3,
                    borderRadius: 2,
                    width: "fit-content",
                    mx: "auto",
                    [theme.breakpoints.down("sm")]: {
                        maxWidth: "100%",
                        width: "100%",
                        "& .MuiTableCell-root": {
                            padding: "6px 8px",
                            fontSize: "0.8rem"
                        }
                    }
                }}
            >
                <Table>
                    <TableHead sx={{ backgroundColor: isDarkMode ? "#333" : "#f5f5f5" }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    color: isDarkMode ? "#fff" : "#000"
                                }}
                            >
                                Año
                            </TableCell>

                            {monedas.map((moneda) => (
                                <TableCell
                                    key={moneda}
                                    align="right"
                                    sx={{
                                        fontWeight: "bold",
                                        color: isDarkMode ? "#fff" : "#000"
                                    }}
                                >
                                    Ingresos en {moneda}
                                </TableCell>
                            ))}

                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                    color: isDarkMode ? "#fff" : "#000"
                                }}
                            >
                                Tendencia
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataNormalizada.length > 0 ? (
                            dataNormalizada
                                .slice(
                                    page * rowsPerPageDefault,
                                    page * rowsPerPageDefault + rowsPerPageDefault
                                )
                                .map((item) => (
                                    <TableRow
                                        key={item.año}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: isDarkMode
                                                    ? "#444"
                                                    : "#f0f0f0"
                                            }
                                        }}
                                    >
                                        <TableCell>{item.año}</TableCell>

                                        {monedas.map((moneda) => (
                                            <TableCell key={moneda} align="right">
                                                {(item.monedas[moneda] ?? 0).toLocaleString(
                                                    undefined,
                                                    {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }
                                                )}
                                            </TableCell>
                                        ))}

                                        <TableCell align="center">
                                            <item.trend.Icon
                                                sx={{ color: item.trend.color }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={monedas.length + 2}
                                    align="center"
                                    sx={{ py: 4 }}
                                >
                                    Aún no hay datos registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {dataNormalizada.length > rowsPerPageDefault && (
                    <TablePagination
                        component="div"
                        count={dataNormalizada.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPageDefault}
                        rowsPerPageOptions={[]}
                        sx={{
                            "& .MuiTablePagination-toolbar": {
                                justifyContent: "center"
                            }
                        }}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} de ${count}`
                        }
                    />
                )}
            </TableContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    No se encontraron datos de pagos.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GananciasTable;