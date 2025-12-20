import { Card, CardContent, Typography, Box } from '@mui/material';

const ProductosCard = ({ producto, onClick, getCategoryIcon }) => {
  const monedaSimbolo = producto.moneda === 'USD' ? '$' : 'C$';
  return (
    <Card
      sx={{
        borderRadius: 2.5,
         width: 260,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 5,
          cursor: 'pointer',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        p: 1,
      }}
      onClick={(e) => onClick(e, producto)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 120,
        }}
      >
        {getCategoryIcon(producto.categoria)}
      </Box>

      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 1 }}>
        <Typography variant="subtitle1" gutterBottom noWrap fontWeight={600}>
          {producto.descripcion}
        </Typography>

        <Typography variant="body1" color="primary" fontWeight={600}>
          {monedaSimbolo}{producto.precio.toFixed(2)}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.8rem' }}
        >
          Existencias: {producto.existencias} | Stock Mínimo: {producto.stockMinimo}
        </Typography>
      </CardContent>
    </Card>
  );
};
export default ProductosCard;