import axios from 'axios';
import BaseUrl from '../../../BaseUrl';

const API_URL = BaseUrl.API_URL_REST+'/api';

export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const addCliente = async (cliente) => {
  try {
    await axios.post(`${API_URL}/clientes`, cliente);
  } catch (error) {
    console.error("Error adding client:", error);
  }
};

export const updateCliente = async (id, cliente) => {
  try {
    await axios.put(`${API_URL}/clientes/${id}`, cliente);
  } catch (error) {
    console.error("Error updating client:", error);
  }
};

export const deleteCliente = async (id) => {
  try {
    await axios.delete(`${API_URL}/clientes/${id}`);
  } catch (error) {
    console.error("Error deleting client:", error);
  }
};
