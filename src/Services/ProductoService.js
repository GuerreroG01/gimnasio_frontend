import axiosInstance from './AxiosInstance';

const API_URL = '/Productos';

const getProductos = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos', error);
    throw error;
  }
};

const getProductoById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener el producto',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const createProducto = async (producto) => {
  try {
    const response = await axiosInstance.post(API_URL, producto, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto', error);
    throw error;
  }
};

const updateProducto = async (id, producto) => {
  try {
    await axiosInstance.put(`${API_URL}/${id}`, producto, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al actualizar el producto', error);
    throw error;
  }
};

const deleteProducto = async (id) => {
  try {
    await axiosInstance.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error al eliminar el producto', error);
    throw error;
  }
};

const getProductosByCategoria = async (categoria) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/categoria/${encodeURIComponent(categoria)}`
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener los productos por categoría',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
const getCategorias = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener las categorías',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
const getProductoByDescripcion = async (descripcion) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}/buscar`,
      {
        params: { descripcion }
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error al obtener el producto por descripción',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const ProductoService = {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getProductosByCategoria,
    getCategorias,
    getProductoByDescripcion
};

export default ProductoService;
