import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.css'; // Importar los estilos

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-animation">
        <h1>404</h1>
        <p>Página no encontrada</p>
      </div>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button className="btn btn-primary" onClick={() => navigate('/home')}>
        Volver al inicio
      </button>
    </div>
  );
};

export default Error404;
