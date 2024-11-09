import React, { useEffect, useState } from 'react';
import { getClientes, addCliente, updateCliente, deleteCliente } from '../services/cliente_service/api';
import Header from '../commons/Header';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    idCliente: null,
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: '',
    fechaCreacion: '',
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleShowModal = (cliente = null) => {
    if (cliente) {
      setModalData(cliente);
    } else {
      setModalData({
        idCliente: null,
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        direccion: '',
        fechaCreacion: new Date().toISOString(),
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!modalData.nombre || !modalData.apellido || !modalData.telefono || !modalData.email || !modalData.direccion) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    if (modalData.idCliente) {
      await updateCliente(modalData.idCliente, modalData);
      Swal.fire('Éxito', 'Cliente actualizado correctamente.', 'success');
    } else {
      await addCliente(modalData);
      Swal.fire('Éxito', 'Cliente agregado correctamente.', 'success');
    }
    setShowModal(false);
    const updatedClientes = await getClientes();
    setClientes(updatedClientes);
  };

  const handleDelete = async (idCliente) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await deleteCliente(idCliente);
      Swal.fire('Eliminado', 'El cliente ha sido eliminado.', 'success');
      const updatedClientes = await getClientes();
      setClientes(updatedClientes);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Lista de Clientes</h2>
        <Button className="mb-3" onClick={() => handleShowModal()}>Agregar Nuevo Cliente</Button>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.idCliente}>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.email}</td>
                <td>{cliente.direccion}</td>
                <td>{new Date(cliente.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(cliente)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(cliente.idCliente)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.idCliente ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
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
              <Form.Group controlId="apellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.apellido}
                  onChange={(e) => setModalData({ ...modalData, apellido: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="telefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.telefono}
                  onChange={(e) => setModalData({ ...modalData, telefono: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={modalData.email}
                  onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  value={modalData.direccion}
                  onChange={(e) => setModalData({ ...modalData, direccion: e.target.value })}
                />
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

export default Clientes;
