import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaginaEnConstruccion.css';

const PaginaEnConstruccion = () => {
  const navigate = useNavigate();

  const handleVolverAtras = () => {
    navigate(-1); // Navega hacia atrás
  };

  return (
    <div className="construction-container">
      <div className="crane-animation">
        <div className="crane-arm"></div>
        <div className="crane-base"></div>
        <div className="hook"></div>
      </div>
      <h1 className="construction-title">Página en Construcción</h1>
      <p className="construction-text">Estamos trabajando arduamente para traerte una experiencia mejorada.</p>
      <p className="construction-text">¡Vuelve pronto para ver las novedades!</p>
      <button className="back-button" onClick={handleVolverAtras}>
        Volver Atrás
      </button>
    </div>
  );
};

export default PaginaEnConstruccion;
