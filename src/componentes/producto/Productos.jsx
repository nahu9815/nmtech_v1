import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import Header from '../commons/Header';
import { deleteProducto, getProductos, updateProducto, uploadImage } from '../services/producto_service/api'; // Importar uploadImage
import Swal from 'sweetalert2';
import jsPDF from 'jspdf'; // Importación de jsPDF para la generación del PDF
import 'jspdf-autotable'; // Importación de la extensión autotable para jsPDF
import BaseUrl from '../../BaseUrl';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [newImage, setNewImage] = useState(null); // Estado para la nueva imagen cargada
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      setFilteredProductos(data);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProducto(id);
        fetchProductos();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = productos.filter((producto) =>
      producto.idProducto.toString().includes(e.target.value) ||
      producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setNewImage(null); // Limpiar el estado de la nueva imagen cuando se abre el modal
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProducto(null);
    setNewImage(null); // Limpiar al cerrar el modal
  };

  const handleUpdateProducto = async () => {
    try {
      let imageUrl = selectedProducto.imagen; // Mantener la URL existente

      if (newImage) {
        const formData = new FormData();
        formData.append('file', newImage);

        // Subir la nueva imagen y obtener la URL
        const response = await uploadImage(formData);
        imageUrl = response.data; // Asignar la nueva URL de la imagen
      }

      const productoData = { ...selectedProducto, imagen: imageUrl };
      await updateProducto(selectedProducto.idProducto, productoData);
      fetchProductos();
      handleCloseModal();
      Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProducto({ ...selectedProducto, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]); // Asignar la nueva imagen cargada
  };

  // Ajuste para obtener la ruta de la imagen desde el servidor backend
  const getImageSrc = (imageName) => {
    return imageName ? `${BaseUrl.API_URL_REST}/uploads/${imageName}` : '';
  };

  // Generar reporte PDF de productos con stock inferior a 5
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Productos con Stock Inferior a 5', 10, 10);
    const productosBajoStock = productos.filter((producto) => producto.stock < 5);

    const tableData = productosBajoStock.map((producto) => [
      producto.idProducto,
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.stock,
    ]);

    doc.autoTable({
      head: [['ID', 'Nombre', 'Descripción', 'Precio', 'Stock']],
      body: tableData,
    });

    doc.save('reporte_productos_bajo_stock.pdf');
  };

  return (
    <div>
      <Header />
      <Container className="mt-4">
        <h1>Catálogo de Productos</h1>

        {/* Buscador */}
        <Form className="mb-4">
          <Form.Control
            type="text"
            placeholder="Buscar por ID, Nombre o Descripción"
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form>

        <div className="d-flex justify-content-between mb-3">
          <h4>Lista de Productos</h4>
          <div>
            <Button variant="success" className="me-2" onClick={generatePDF}>
              Generar Reporte PDF
            </Button>
            <Button variant="primary" onClick={() => navigate('/addproduct')}>
              Agregar Producto
            </Button>
          </div>
        </div>

        <Row>
          {filteredProductos.length > 0 ? (
            filteredProductos.map((producto) => (
              <Col md={4} className="mb-4" key={producto.idProducto}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={getImageSrc(producto.imagen)}
                    alt={producto.nombre}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text>{producto.descripcion}</Card.Text>
                    <Card.Text>Precio: ${producto.precio}</Card.Text>
                    <Card.Text>Stock: {producto.stock}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="info" onClick={() => handleEdit(producto)}>
                        Ver detalle
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(producto.idProducto)}>
                        Eliminar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No hay productos disponibles.</p>
          )}
        </Row>

        {/* Modal para Información y Edición del Producto */}
        {selectedProducto && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div className="text-center mb-3">
                  <img
                    src={getImageSrc(selectedProducto.imagen)}
                    alt={selectedProducto.nombre}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <Form.Group controlId="formNombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={selectedProducto.nombre}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDescripcion" className="mt-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descripcion"
                    rows={3}
                    value={selectedProducto.descripcion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPrecio" className="mt-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={selectedProducto.precio}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formStock" className="mt-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={selectedProducto.stock}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formImagen" className="mt-3">
                  <Form.Label>Cargar nueva imagen (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleUpdateProducto}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default Productos;
