import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './commons/Header';
import { FaCashRegister, FaBoxes, FaUsers, FaTools, FaChartLine } from 'react-icons/fa';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { getVentasAnuales, getVentasDiarias, getVentasMensuales, getVentasSemanales } from './services/venta_service/api';
import VentasMensualesChart from './ventas/VentasMensualesChart';

const Home = () => {
  const [ventasDiarias, setVentasDiarias] = useState(0);
  const [ventasSemanales, setVentasSemanales] = useState(0);
  const [ventasMensuales, setVentasMensuales] = useState(0);
  const [ventasAnuales, setVentasAnuales] = useState(0);

  // Obtener el usuario desde el estado global de Redux
  const usuario = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (usuario && usuario.rol === 'ADMIN') {
      fetchVentasData();
    }
  }, [usuario]);

  const fetchVentasData = async () => {
    try {
      const diarias = await getVentasDiarias();
      const semanales = await getVentasSemanales();
      const mensuales = await getVentasMensuales();
      const anuales = await getVentasAnuales();

      // Convertir BigDecimal a número
      setVentasDiarias(parseFloat(diarias) || 0);
      setVentasSemanales(parseFloat(semanales) || 0);
      setVentasMensuales(parseFloat(mensuales) || 0);
      setVentasAnuales(parseFloat(anuales) || 0);
    } catch (error) {
      console.error('Error al cargar los datos de ventas:', error);
    }
  };

  return (
    <div>
      <Header />
      <Container className="mt-5">
        {/* Hero Section */}
        <div className="jumbotron text-center bg-dark text-white py-5 rounded">
          <h1 className="display-4">Sistema de Gestión de Stock y Ventas</h1>
          <p className="lead">Repuestos de motos y servicios de rectificación de calidad.</p>
          <Button href="/ventas" variant="light" size="lg" className="mt-3">
            Gestionar Ventas
          </Button>
        </div>

        {/* Sección de Estadísticas de Ventas (visible solo para ADMIN) */}
        {usuario && usuario.rol === 'ADMIN' && (
          <>
            <Row className="text-center mt-5">
              <Col md={6} lg={3} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <FaChartLine size={40} className="text-primary mb-3" />
                    <h5>Ventas Diarias</h5>
                    <h3 className="text-dark">${ventasDiarias}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <FaChartLine size={40} className="text-success mb-3" />
                    <h5>Ventas Semanales</h5>
                    <h3 className="text-dark">${ventasSemanales}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <FaChartLine size={40} className="text-warning mb-3" />
                    <h5>Ventas Mensuales</h5>
                    <h3 className="text-dark">${ventasMensuales}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <FaChartLine size={40} className="text-danger mb-3" />
                    <h5>Ventas Anuales</h5>
                    <h3 className="text-dark">${ventasAnuales}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="mt-5">
              <VentasMensualesChart />
            </div>
          </>
        )}

        {/* Secciones de Gestión */}
        <Row className="text-center mt-5">
          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <FaCashRegister size={40} className="text-primary mb-3" />
                <h3 className="card-title">Ventas</h3>
                <p>Gestiona las ventas de repuestos de motos fácilmente.</p>
                <Button href="/ventas" variant="primary">
                  Ir a Ventas
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <FaBoxes size={40} className="text-primary mb-3" />
                <h3 className="card-title">Productos</h3>
                <p>Controla el stock de repuestos y mantenlo actualizado.</p>
                <Button href="/products" variant="primary">
                  Ir a Productos
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <FaUsers size={40} className="text-primary mb-3" />
                <h3 className="card-title">Clientes</h3>
                <p>Administra la información de tus clientes y sus servicios.</p>
                <Button href="/clientes" variant="primary">
                  Ir a Clientes
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <FaUsers size={40} className="text-primary mb-3" />
                <h3 className="card-title">Empleados</h3>
                <p>Gestiona a los empleados que realizan los servicios de rectificación.</p>
                <Button href="/users" variant="primary">
                  Ir a Empleados
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <FaTools size={40} className="text-primary mb-3" />
                <h3 className="card-title">Servicios</h3>
                <p>Monitorea los servicios de rectificación de motores.</p>
                <Button href="/services" variant="primary">
                  Ir a Servicios
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
