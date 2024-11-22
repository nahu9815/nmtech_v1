import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaCogs } from 'react-icons/fa';
import './Header.css'; // Archivo CSS adicional para un estilo mejorado

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
//  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/home" className="brand-logo">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt="Logo"
              width="35"
              height="35"
              className="d-inline-block align-top"
            />{' '}
            MAGIC
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/home">Inicio</Nav.Link>
              <Nav.Link href="/ventas">Ventas</Nav.Link>
              <NavDropdown title="Productos" id="products-nav-dropdown">
                <NavDropdown.Item href="/categories">Categorías</NavDropdown.Item>
                <NavDropdown.Item href="/products">Productos</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/clientes">Clientes</Nav.Link>
              <Nav.Link href="/users">Empleados</Nav.Link>
              <Nav.Link href="/services">Servicios</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown
                title={<FaCogs size={24} className="settings-icon" />}
                id="settings-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
