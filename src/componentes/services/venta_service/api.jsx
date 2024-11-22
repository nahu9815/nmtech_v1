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
    return response;
  } catch (error) {
    console.error("Error adding sale:", error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
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

// Servicio para obtener las ventas diarias
export const getVentasDiarias = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas/diarias`);
    return response.data;
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    return [];
  }
};

// Servicio para obtener las ventas semanales
export const getVentasSemanales = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas/semanales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    return [];
  }
};

// Servicio para obtener las ventas mensuales
export const getVentasMensuales = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas/mensuales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    return [];
  }
};

// Servicio para obtener las ventas anuales
export const getVentasAnuales = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas/anuales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching yearly sales:", error);
    return [];
  }
};

// Servicio para obtener los totales de ventas mensuales
export const getVentasTotalesMensuales = async () => {
  try {
    const response = await axios.get(`${API_URL}/ventas/ventas/totales-mensuales`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly sales totals:", error);
    return {};
  }
};