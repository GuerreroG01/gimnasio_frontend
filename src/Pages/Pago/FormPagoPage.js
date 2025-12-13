import PagoForm from "../../Components/Pago/PagoForm";
import { useLocation } from "react-router-dom";

export default function FormPagoPage() {
  const location = useLocation();
  const usuarioId = location.state?.usuarioId || null;

  return (
    <PagoForm usuarioId={usuarioId} />
  );
}