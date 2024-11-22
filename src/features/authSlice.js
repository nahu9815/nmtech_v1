import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import BaseUrl from '../BaseUrl';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Recuperar del localStorage
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Guardar en localStorage
      localStorage.setItem('isAuthenticated', 'true'); // Persistir autenticación
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user'); // Limpiar el localStorage
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(BaseUrl.API_URL_REST+'/login', credentials);
    dispatch(loginSuccess(response.data));
    console.log(response.data);
  } catch (error) {
    // Maneja correctamente el error, verificando si existe `error.response`
    const errorMessage = error.response?.data?.message || 'Error desconocido. Por favor, inténtelo de nuevo.';
    dispatch(loginFailure(errorMessage));
  }
};

export default authSlice.reducer;
