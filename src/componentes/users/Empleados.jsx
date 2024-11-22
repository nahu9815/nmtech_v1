import React, { useEffect, useState } from 'react';
import { getUsuarios, addUsuario, updateUsuario, deleteUsuario } from '../services/usuario_service/api';
import Header from '../commons/Header';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert'; // Importa Alert de Bootstrap
import './Empleados.css'; // Archivo CSS para estilos personalizados de las cards
import { useSelector } from 'react-redux';

const Empleados = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    idUsuario: null,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'ADMIN',
    fechaCreacion: '',
  });
  const [alertMessage, setAlertMessage] = useState(''); // Estado para el mensaje de alerta
  const user = useSelector((state) => state.auth.user); // Obtener el usuario actual desde el estado de Redux

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await getUsuarios();
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  const handleShowModal = (usuario = null) => {
    if (user.rol === 'VENDEDOR') {
      setAlertMessage('No tienes permisos para realizar esta acción.');
      return;
    }
    if (usuario) {
      setModalData(usuario);
    } else {
      setModalData({
        idUsuario: null,
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'ADMIN',
        fechaCreacion: new Date().toISOString(),
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!modalData.nombre || !modalData.apellido || !modalData.email || !modalData.password || !modalData.rol) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    if (modalData.idUsuario) {
      await updateUsuario(modalData.idUsuario, modalData);
      Swal.fire('Éxito', 'Usuario actualizado correctamente.', 'success');
    } else {
      await addUsuario(modalData);
      Swal.fire('Éxito', 'Usuario agregado correctamente.', 'success');
    }
    setShowModal(false);
    const updatedUsuarios = await getUsuarios();
    setUsuarios(updatedUsuarios);
  };

  const handleDelete = async (idUsuario) => {
    console.log(user.rol)
    if (user.rol === 'VENDEDOR') {
      setAlertMessage('No tienes permisos para realizar esta acción.');
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await deleteUsuario(idUsuario);
      Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
      const updatedUsuarios = await getUsuarios();
      setUsuarios(updatedUsuarios);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Lista de Empleados</h2>
        {alertMessage && (
          <Alert variant="danger" onClose={() => setAlertMessage('')} dismissible>
            {alertMessage}
          </Alert>
        )}
        <Button
          className="mb-3"
          onClick={() => handleShowModal()}
          disabled={user.rol === 'VENDEDOR'} // Deshabilitar el botón si el usuario es VENDEDOR
        >
          Agregar Nuevo Usuario
        </Button>

        {/* Lista de Cards */}
        <div className="card-container">
          {usuarios.map((usuario) => (
            <Card key={usuario.idUsuario} className="mb-3">
              <Card.Body>
                <Card.Title>{usuario.nombre} {usuario.apellido}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{usuario.rol}</Card.Subtitle>
                <Card.Text>
                  <strong>Email:</strong> {usuario.email} <br />
                  <strong>Fecha de Creación:</strong> {new Date(usuario.fechaCreacion).toLocaleDateString()}
                </Card.Text>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(usuario)}
                  disabled={user.rol === 'VENDEDOR'} // Deshabilitar el botón si el usuario es VENDEDOR
                >
                  Editar
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(usuario.idUsuario)}
                  disabled={user.rol === 'VENDEDOR'} // Deshabilitar el botón si el usuario es VENDEDOR
                >
                  Eliminar
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Modal para agregar/editar usuario */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.idUsuario ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.nombre}
                  onChange={(e) => setModalData({ ...modalData, nombre: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="apellido" className="mt-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.apellido}
                  onChange={(e) => setModalData({ ...modalData, apellido: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={modalData.email}
                  onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={modalData.password}
                  onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="rol" className="mt-3">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={modalData.rol}
                  onChange={(e) => setModalData({ ...modalData, rol: e.target.value })}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSave}>Guardar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Empleados;
