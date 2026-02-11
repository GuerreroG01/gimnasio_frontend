import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../Components/Login/Login";
import { AuthContext } from "../../Context/AuthContext";

export default function LoginPage(){
    const [username, setUsername] = React.useState("");
    const [clave, setClave] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const { login } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: "",
        severity: "success",
    });


    const handleLogin = async () => {
        setLoading(true);

        try {
            const loginData = { username, clave };
            await login(loginData);

            setSnackbar({
                open: true,
                message: "Credenciales Correctos",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            setSnackbar({
                open: true,
                message: "Credenciales incorrectas o error en login.",
                severity: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };
    return(
        <Login
            handleLogin={handleLogin}
            handleKeyPress={handleKeyPress}
            username={username}
            setUsername={setUsername}
            clave={clave}
            setClave={setClave}
            loading={loading}
            snackbar={snackbar}
            setSnackbar={setSnackbar}
            navigate={navigate} 

        />
    );
}