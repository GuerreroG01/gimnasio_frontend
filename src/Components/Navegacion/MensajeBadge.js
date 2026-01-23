import { Badge, useTheme } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useMensajes } from '../../Context/MensajeContext';

const MensajeBadge = ({ color = 'success', iconSize = 26 }) => {
  const { noLeidos } = useMensajes();
  const theme = useTheme();
  // 🔹 total de mensajes no leídos (usuarios + sistema)
  const total = noLeidos.usuarios + noLeidos.sistema;

  return (
    <Badge
      color={color}
      // 🔹 Si total > 0 mostramos el punto rojo
      variant={total > 0 ? 'dot' : undefined}
      overlap="circular"
    >
      <MailOutlineIcon
        sx={{
          fontSize: iconSize,
          color: total > 0 ? theme.palette.success.main : theme.palette.text.secondary,
          cursor: 'pointer',
          '&:hover': {
            color: theme.palette.success.main,
          },
        }}
      />
    </Badge>
  );
};
export default MensajeBadge;