import axios from 'axios';
import BaseUrl from '../../../BaseUrl';

const API_URL = `${BaseUrl.API_URL_REST}/api`;

// Servicio para obtener todas las ventas
export const getVentas = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales:", error);
    return [];
  }
};

// Servicio para obtener una venta por su ID
export const getVentaById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sale with id ${id}:`, error);
    return null;
  }
};

// Servicio para crear una nueva venta
export const addVenta = async (venta) => {
  try {
    const response = await axios.post(`${API_URL}/ventas`, venta);
    return response.data;
  } catch (error) {
    console.error("Error adding sale:", error);
  }
};

// Servicio para actualizar una venta
export const updateVenta = async (id, venta) => {
  try {
    const response = await axios.put(`${API_URL}/ventas/${id}`, venta);
    return response.data;
  } catch (error) {
    console.error(`Error updating sale with id ${id}:`, error);
  }
};

// Servicio para eliminar una venta
export const deleteVenta = async (id) => {
  try {
    await axios.delete(`${API_URL}/ventas/${id}`);
  } catch (error) {
    console.error(`Error deleting sale with id ${id}:`, error);
  }
};
