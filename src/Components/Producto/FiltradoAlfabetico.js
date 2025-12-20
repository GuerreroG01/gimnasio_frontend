import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const FiltradoAlfabetico = ({ productos, setProductos, allProductos }) => {
  const letras = Array.from(new Set(allProductos.map((producto) => producto.descripcion[0].toUpperCase()))).sort();

  const [selectedLetter, setSelectedLetter] = React.useState('');

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    if (letter) {
      const filtered = allProductos.filter((producto) =>
        producto.descripcion.toLowerCase().startsWith(letter.toLowerCase())
      );
      setProductos(filtered);
    } else {
      setProductos(allProductos);
    }
  };

  return (
    <ButtonGroup
      variant="text"
      sx={{
        marginBottom: 3,
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      <Button
        onClick={() => handleLetterClick('')}
        sx={{
          backgroundColor: selectedLetter === '' ? '#1976d2' : 'transparent',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
          color: selectedLetter === '' ? '#fff' : '#1976d2',
          fontWeight: selectedLetter === '' ? 'bold' : 'normal',
          textTransform: 'none',
        }}
      >
        Todos
      </Button>
      {letras.map((letra) => (
        <Button
          key={letra}
          onClick={() => handleLetterClick(letra)}
          sx={{
            backgroundColor: selectedLetter === letra ? '#1976d2' : 'transparent',
            '&:hover': {
              backgroundColor: '#eeeeee',
            },
            color: selectedLetter === letra ? '#fff' : '#1976d2',
            fontWeight: selectedLetter === letra ? 'bold' : 'normal',
            textTransform: 'none',
          }}
        >
          {letra}
        </Button>
      ))}
    </ButtonGroup>
  );
};
export default FiltradoAlfabetico;