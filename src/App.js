import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './componentes/login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './componentes/Home';
import Clientes from './componentes/clientes/Clientes';
import Productos from './componentes/producto/Productos';
import AgregarProducto from './componentes/producto/AgregarProducto';
import Empleados from './componentes/users/Empleados';
import Ventas from './componentes/ventas/Ventas';
import Categoria from './componentes/categoria/Categoria';
import PaginaEnConstruccion from './componentes/commons/PaginaEnConstruccion';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    document.title = 'MAGIC'; // Cambia esto al título que desees
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/clientes"
          element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />

        <Route
          path="/products"
          element={isAuthenticated ? <Productos /> : <Navigate to="/login" />}
        />

        <Route path='/users' element={isAuthenticated ? <Empleados /> : <Navigate to="/login"></Navigate>} >

        </Route>

        <Route path='/categories' element={isAuthenticated ? <Categoria /> : <Navigate to="/login"></Navigate>} >

        </Route>

        <Route path='/ventas' element={isAuthenticated ? <Ventas /> : <Navigate to="/login"></Navigate>} >

        </Route>
        <Route path='/services' element={isAuthenticated ? <PaginaEnConstruccion /> : <Navigate to="/login"></Navigate>} >

        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          path="/addproduct"
          element={isAuthenticated ? <AgregarProducto /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>

    </Router>
  );
};

export default App;
