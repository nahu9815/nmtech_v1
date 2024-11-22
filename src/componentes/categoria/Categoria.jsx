import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, ListGroup, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { createCategoria, deleteCategoria, getCategoriaById, getCategorias, updateCategoria } from '../services/categoria_service/api';
import Header from '../commons/Header';

const Categoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState({ idCategoria: '', nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await getCategorias();
    setCategorias(data);
  };

  const handleEdit = async (id) => {
    const categoria = await getCategoriaById(id);
    setSelectedCategoria(categoria);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategoria(id);
        fetchCategorias();
        Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
      }
    });
  };

  const handleShowModal = () => {
    setSelectedCategoria({ idCategoria: '', nombre: '', descripcion: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCategoria({ ...selectedCategoria, [name]: value });
  };

  const handleSubmit = async () => {
    if (isEditing) {
      await updateCategoria(selectedCategoria.idCategoria, selectedCategoria);
      Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
    } else {
      await createCategoria(selectedCategoria);
      Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
    }
    fetchCategorias();
    handleCloseModal();
  };

  return (
    <div><Header></Header>
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h2>Gestión de Categorías</h2>
          <Button variant="primary" onClick={handleShowModal}>
            Crear Nueva Categoría
          </Button>
        </Col>
      </Row>
      <ListGroup>
        {categorias.map((categoria) => (
          <ListGroup.Item key={categoria.idCategoria} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{categoria.nombre}</h5>
              <p className="mb-1">{categoria.descripcion}</p>
            </div>
            <div>
              <Button variant="warning" className="me-2" onClick={() => handleEdit(categoria.idCategoria)}>
                Editar
              </Button>
              <Button variant="danger" onClick={() => handleDelete(categoria.idCategoria)}>
                Eliminar
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal para Crear/Editar Categoría */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={selectedCategoria.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre de la categoría"
              />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                rows={3}
                value={selectedCategoria.descripcion}
                onChange={handleInputChange}
                placeholder="Ingrese la descripción de la categoría"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
};

export default Categoria;
