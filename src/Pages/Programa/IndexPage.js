import React, { useEffect } from "react";
import ProgrmaFitService from '../../Services/ProgramaFitService';
import IndexPrograma from "../../Components/ProgramaFit/Programa/IndexPrograma";
import { getNombreDia } from "../../Utils/Constants";

export default function IndexPage() {

    const [programas, setProgramas] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [nivel, setNivel] = React.useState('');
    const [tipo, setTipo] = React.useState('');
    const [nivelesDisponibles, setNivelesDisponibles] = React.useState([]);
    const [tiposDisponibles, setTiposDisponibles] = React.useState([]);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const showSnackbar = React.useCallback((message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    }, []);
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    const fetchProgramas = React.useCallback(async (nivelSeleccionado, tipoSeleccionado) => {
        if (!nivelSeleccionado) {
            setProgramas([]);
            return;
        }

        setLoading(true);
        try {
            const data = await ProgrmaFitService.getProgramas(
                nivelSeleccionado,
                tipoSeleccionado === 'Todos' ? null : tipoSeleccionado
            );

            const programasConDia = Array.isArray(data)
                ? data.map(programa => ({
                    ...programa,
                    diaNombre: getNombreDia(programa.dia),
                }))
                : [];

            setProgramas(programasConDia);
        } catch (error) {
            const backendMessage = error?.response?.data ||
                'Error al obtener categorías.';

            showSnackbar(backendMessage, 'error');
            setProgramas([]);
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        const cargarFiltros = async () => {
            try {
                setLoading(true);

                const niveles = await ProgrmaFitService.getNiveles();
                setNivelesDisponibles(niveles);

                if (niveles.length > 0) {
                    const primerNivel = niveles[0];
                    setNivel(primerNivel);

                    const tipos = await ProgrmaFitService.getTiposByNiveles(primerNivel);
                    setTiposDisponibles(tipos);
                    setTipo(tipos.length > 0 ? tipos[0] : '');

                    await fetchProgramas(primerNivel, tipos.length > 0 ? tipos[0] : '');
                }

            } catch (error) {
                console.error('Error cargando filtros', error);
                const backendMessage = error?.response?.data ||
                    'Error al obtener categorías.';

                showSnackbar(backendMessage, 'error');
            } finally {
                setLoading(false);
            }
        };

        cargarFiltros();
    }, [fetchProgramas, showSnackbar]);

    useEffect(() => {
        if (!nivel) return;

        const actualizarTiposYProgramas = async () => {
            try {
                setLoading(true);

                const tipos = await ProgrmaFitService.getTiposByNiveles(nivel);
                setTiposDisponibles(tipos);
                const primerTipo = tipos.length > 0 ? tipos[0] : '';
                setTipo(primerTipo);

                await fetchProgramas(nivel, primerTipo);

            } catch (error) {
                console.error('Error actualizando tipos y programas', error);
            } finally {
                setLoading(false);
            }
        };

        actualizarTiposYProgramas();
    }, [nivel, fetchProgramas]);

    useEffect(() => {
        if (!nivel) return;
        fetchProgramas(nivel, tipo);
    }, [tipo, nivel, fetchProgramas]);
    return (
        <IndexPrograma
            programas={programas}
            loading={loading}
            nivel={nivel}
            setNivel={setNivel}
            tipo={tipo}
            setTipo={setTipo}
            nivelesDisponibles={nivelesDisponibles}
            tiposDisponibles={tiposDisponibles}
            snackbar={snackbar}
            handleCloseSnackbar={handleCloseSnackbar}
        />
    );
}