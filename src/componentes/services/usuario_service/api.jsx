import axios from 'axios';
import BaseUrl from '../../../BaseUrl';

const API_URL = BaseUrl.API_URL_REST+'/api';

// Servicio para obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Servicio para agregar un usuario
export const addUsuario = async (usuario) => {
  try {
    await axios.post(`${API_URL}/usuarios`, usuario);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Servicio para actualizar un usuario
export const updateUsuario = async (id, usuario) => {
  try {
    await axios.put(`${API_URL}/usuarios/${id}`, usuario, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }
};
// Servicio para eliminar un usuario
export const deleteUsuario = async (id) => {
  try {
    await axios.delete(`${API_URL}/usuarios/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
