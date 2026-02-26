import React,{ useCallback, useEffect } from "react";
import UserService from "../../Services/UserService";
import Register from "../../Components/User/Register";
import { useNavigate, useParams } from "react-router-dom";

export default function FormPage() {

    const { id } = useParams();
    const isEdit = Boolean(id);

    const navigate = useNavigate();

    const [formData, setFormData] = React.useState({
        usuario: "",
        clave: "",
        email: "",
        telefono: "",
        fechaIngreso: new Date().toISOString(),
        activo: true
    });

    const [snackbarInfo, setSnackbarInfo] = React.useState({
        open: false,
        message: "",
        severity: "success",
        loading: false,
        onClose: () => setSnackbarInfo(prev => ({ ...prev, open: false }))
    });

    const loadUser = useCallback(async () => {
        try {
            const response = await UserService.getUserById(id);
            setFormData({
                ...response.data,
                clave: ""
            });
        } catch (error) {
            console.error("Error cargando usuario:", error);
            navigate("/configuraciones");
        }
    }, [id, navigate]);

    useEffect(() => {
        if (isEdit) {
            loadUser();
        }
    }, [isEdit, loadUser]);

    const toggleActivo = () => {
        setFormData(prev => ({ ...prev, activo: !prev.activo }));
    };

    const handleSubmit = async () => {

        setSnackbarInfo(prev => ({ ...prev, loading: true }));

        if (!formData.usuario || !formData.email || !formData.telefono) {
            setSnackbarInfo({
                open: true,
                message: "Los campos Usuario, Email y Teléfono son obligatorios.",
                severity: "error",
                loading: false,
                onClose: () => setSnackbarInfo(prev => ({ ...prev, open: false }))
            });
            return;
        }

        if (!isEdit && !formData.clave) {
            setSnackbarInfo({
                open: true,
                message: "La contraseña es obligatoria.",
                severity: "error",
                loading: false,
                onClose: () => setSnackbarInfo(prev => ({ ...prev, open: false }))
            });
            return;
        }

        try {
            let dataToSend = { ...formData };

            if (isEdit && !dataToSend.clave) {
                delete dataToSend.clave;
            }

            if (isEdit) {
                await UserService.updateUser(id, dataToSend);
            } else {
                await UserService.createUser(dataToSend);
            }

            setSnackbarInfo({
                open: true,
                message: isEdit
                    ? "¡Usuario actualizado correctamente!"
                    : "¡Registro exitoso!",
                severity: "success",
                loading: false,
                onClose: () => setSnackbarInfo(prev => ({ ...prev, open: false }))
            });

            setTimeout(() => navigate("/configuraciones"), 2000);

        } catch (err) {
            console.error("Error:", err);

            const errorMessage =
                err.response?.data?.message ||
                (isEdit
                    ? "Error al actualizar usuario."
                    : "Error al registrar usuario.");

            setSnackbarInfo({
                open: true,
                message: errorMessage,
                severity: "error",
                loading: false,
                onClose: () => setSnackbarInfo(prev => ({ ...prev, open: false }))
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <Register
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
            toggleActivo={toggleActivo}
            snackbarInfo={snackbarInfo}
            isEdit={isEdit}
        />
    );
}