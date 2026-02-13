import React, { useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import ProgramaFitService from '../../Services/ProgramaFitService';
import ProgramasForm from "../../Components/ProgramaFit/Programa/ProgramasForm";
import { DIAS_SEMANA } from "../../Utils/Constants";

const initialForm = {
    titulo: "",
    tipo: "",
    nivel: "",
    ordenNivel: 0,
    duracion: 1,
    contenido: "",
    orden: 1,
    dia: 1,
    activo: true,
    generoDedicado:""
};

export default function FormPage() {
    const { id } =  useParams();
    const navigate = useNavigate();
    const programaId = id ? parseInt(id) : null;
    const onSuccess = () => navigate('/programas');
    const [form, setForm] = React.useState(initialForm);
    const [loading, setLoading] = React.useState(false);
    const isEditMode = Boolean(programaId);
    const [rutinasSeleccionadas, setRutinasSeleccionadas] = React.useState([]);
    const dia = DIAS_SEMANA;

    useEffect(() => {
        if (!isEditMode) return;

        setLoading(true);
        ProgramaFitService.getProgramaPorId(programaId)
            .then((data) => {
            setForm({
                titulo: data.titulo,
                tipo: data.tipo,
                nivel: data.nivel,
                ordenNivel: data.ordenNivel,
                duracion: data.duracion,
                contenido: data.contenido ?? "",
                orden: data.orden,
                dia: data.dia,
                activo: data.activo,
                generoDedicado: data.generoDedicado,
            });

            const rutinas = data.programaRutinas.map(pr => pr.rutinaFit);
            setRutinasSeleccionadas(rutinas);
            })
            .finally(() => setLoading(false));
    }, [programaId, isEditMode]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...(isEditMode && { id: programaId }),
                ...form,
                duracion: Number(form.duracion),
                orden: Number(form.orden),
                dia: Number(form.dia),
                programaRutinas: rutinasSeleccionadas.map(r => ({
                    rutinaFitId: r.id
                }))
            };

            if (isEditMode) {
                console.log('Enviando en update:', programaId, payload);
                await ProgramaFitService.putPrograma(programaId, payload);
            } else {
                await ProgramaFitService.postPrograma(payload);
                setForm(initialForm);
                setRutinasSeleccionadas([]);
            }

            onSuccess?.();
        } catch (error) {
            console.error("Error al guardar programa", error);
        } finally {
            setLoading(false);
        }
    };
    const isStep1Valid = () => {
        return (
            form.titulo?.trim() !== "" &&
            form.nivel?.trim() !== "" &&
            form.tipo?.trim() !== "" &&
            form.generoDedicado?.trim() !== "" &&
            form.duracion > 0 &&
            form.orden > 0 &&
            form.dia > 0
        );
        };
    const isStep2Valid = () => {
        return rutinasSeleccionadas.length > 0;
    };

    return (
        <ProgramasForm
            programaId={programaId} onSuccess={onSuccess} form={form}
            loading={loading} handleChange={handleChange} handleSubmit={handleSubmit}
            rutinasSeleccionadas={rutinasSeleccionadas} setRutinasSeleccionadas={setRutinasSeleccionadas}
            dia={dia} isStep1Valid={isStep1Valid} isStep2Valid={isStep2Valid}
        />
    );
}