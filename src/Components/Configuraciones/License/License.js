import { useEffect, useState, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";

import LicenseService from "../../../Services/LicenseService";
import LicenseInfo from "./LicenseInfo";
import ActivateLicense from "./ActivateLicense";

import { AuthContext } from "../../../Context/AuthContext";

const License = () => {
    const { rol } = useContext(AuthContext);
    const [license, setLicense] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLicense = async () => {
        try {
            const data = await LicenseService.getActiveLicense();
            setLicense(data);
        } catch {
            setLicense(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicense();
    }, []);

    if (rol !== "SuperAdmin" && rol !== "Admin") {
        return null;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
            width="100%"
        >
            {license ? (
                <LicenseInfo license={license} />
            ) : (
                <ActivateLicense onActivated={fetchLicense} />
            )}
        </Box>
    );
};
export default License;