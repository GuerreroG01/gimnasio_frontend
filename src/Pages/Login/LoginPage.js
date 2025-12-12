import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../Components/Login/Login";
import { AuthContext } from "../../Context/AuthContext";

export default function LoginPage(){
    const [username, setUsername] = React.useState("");
    const [clave, setClave] = React.useState("");
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const { login } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            console.log("Credenciales:", { username, clave });
            const loginData = { username, clave };
            await login(loginData);  
            setOpenSnackbar(true);

            navigate("/");
        } catch (err) {
            setError("Credenciales incorrectas o error en login.");
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
            error={error}
            loading={loading}
            openSnackbar={openSnackbar}
            setOpenSnackbar={setOpenSnackbar}
            navigate={navigate} 
        />
    );
}