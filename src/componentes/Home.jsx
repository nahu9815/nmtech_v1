import React from 'react';
import Header from './commons/Header';

const Home = () => {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        {/* Hero Section */}
        <div className="jumbotron text-center bg-primary text-white py-5 rounded">
          <h1 className="display-4">Sistema de Gestión de Stock y Ventas</h1>
          <p className="lead">Repuestos de motos y servicios de rectificación de calidad.</p>
          <a href="/ventas" className="btn btn-light btn-lg mt-3">Gestionar Ventas</a>
        </div>

        {/* Secciones de Gestión */}
        <div className="row text-center mt-5">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Ventas</h3>
                <p className="card-text">Gestiona las ventas de repuestos de motos fácilmente.</p>
                <a href="/ventas" className="btn btn-primary">Ir a Ventas</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Productos</h3>
                <p className="card-text">Controla el stock de repuestos y mantenlo actualizado.</p>
                <a href="/products" className="btn btn-primary">Ir a Productos</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Clientes</h3>
                <p className="card-text">Administra la información de tus clientes y sus servicios.</p>
                <a href="/clientes" className="btn btn-primary">Ir a Clientes</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Empleados</h3>
                <p className="card-text">Gestiona a los empleados que realizan los servicios de rectificación.</p>
                <a href="/users" className="btn btn-primary">Ir a Empleados</a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Servicios</h3>
                <p className="card-text">Monitorea los servicios de rectificación de motores.</p>
                <a href="/servicios" className="btn btn-primary">Ir a Servicios</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
