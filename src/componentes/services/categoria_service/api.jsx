import axios from 'axios';
import BaseUrl from '../../../BaseUrl';

const API_URL = BaseUrl.API_URL_REST;

// Obtener todas las categorías
export const getCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/categorias`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Obtener categoría por ID
export const getCategoriaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    return null;
  }
};

// Crear una nueva categoría
export const createCategoria = async (categoriaData) => {
  try {
    const response = await axios.post(`${API_URL}/categorias`, categoriaData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

// Actualizar una categoría existente
export const updateCategoria = async (id, categoriaData) => {
  try {
    const response = await axios.put(`${API_URL}/categorias/${id}`, categoriaData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    return null;
  }
};

// Eliminar una categoría
export const deleteCategoria = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    return null;
  }
};
