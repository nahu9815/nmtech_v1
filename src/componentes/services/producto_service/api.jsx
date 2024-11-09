import axios from 'axios';
import BaseUrl from '../../../BaseUrl';

const API_URL = BaseUrl.API_URL_REST;

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductosBySearch = async (searchTerm = '') => {
    try {
      const response = await axios.get(`${API_URL}/productos/buscar`, {
        params: { searchTerm }, // Agregar el término de búsqueda a la URL
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };
  
// Obtener producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

// Crear un nuevo producto
export const createProducto = async (productoData) => {
  try {
    const response = await axios.post(`${API_URL}/productos`, productoData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

// Actualizar un producto existente
export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_URL}/productos/${id}`, productoData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    return null;
  }
};

// Eliminar un producto
export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    return null;
  }
};
