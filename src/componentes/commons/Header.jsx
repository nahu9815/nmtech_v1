import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/ventas">Gestionar Ventas</Nav.Link>
            <NavDropdown title="Gestionar Productos" id="basic-nav-dropdown">
              <NavDropdown.Item href="/products/categories">Categorías</NavDropdown.Item>
              <NavDropdown.Item href="/products">Productos</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/clientes">Clientes</Nav.Link>
            <Nav.Link href="/users">Empleados</Nav.Link>
            <Nav.Link href="/services">Servicios</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Mi Perfil" id="profile-nav-dropdown">
              <NavDropdown.Item href="/profile">Ver Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
