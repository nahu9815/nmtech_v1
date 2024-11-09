import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
      localStorage.setItem('isAuthenticated', true); // Persistir autenticación
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
    const response = await axios.post('http://192.168.0.102:8080/login', credentials);
    dispatch(loginSuccess(response.data));
    console.log(response.data)
  } catch (error) {
    dispatch(loginFailure(error.response.data.message));
  }
};

export default authSlice.reducer;
