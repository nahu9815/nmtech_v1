import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getClientes } from '../services/cliente_service/api';
import { getProductos } from '../services/producto_service/api';
import { getVentas, addVenta, deleteVenta } from '../services/venta_service/api';
import Header from '../commons/Header';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Ventas.css';

const Ventas = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedProducto, setSelectedProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [lineasVenta, setLineasVenta] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      const clientesData = await getClientes();
      const productosData = await getProductos();
      const ventasData = await getVentas();
      setClientes(clientesData);
      setProductos(productosData);
      setVentas(ventasData);
    };
    fetchData();
  }, []);

  const handleAddProducto = () => {
    if (!selectedProducto || cantidad <= 0) {
      Swal.fire('Error', 'Seleccione un producto y asegúrese de que la cantidad sea válida.', 'error');
      return;
    }

    const producto = productos.find(prod => prod.idProducto === parseInt(selectedProducto));
    if (!producto) {
      Swal.fire('Error', 'El producto seleccionado no es válido.', 'error');
      return;
    }

    const subtotal = producto.precio * cantidad;
    const newLinea = {
      idProducto: producto.idProducto,
      cantidad,
      precioUnitario: producto.precio,
      subtotal,
      producto
    };

    setLineasVenta([...lineasVenta, newLinea]);
    setTotal(total + subtotal);
    setSelectedProducto('');
    setCantidad(1);
  };

  const handleRemoveProducto = (index) => {
    const updatedLineasVenta = [...lineasVenta];
    const removedProduct = updatedLineasVenta.splice(index, 1)[0];
    setLineasVenta(updatedLineasVenta);
    setTotal(total - removedProduct.subtotal);
  };

  const handleSaveVenta = async () => {
    if (!selectedCliente || lineasVenta.length === 0) {
      Swal.fire('Error', 'Seleccione un cliente y agregue al menos un producto a la venta.', 'error');
      return;
    }

    const nuevaVenta = {
      cliente: { idCliente: selectedCliente },
      usuario: { idUsuario: user.id },
      fechaVenta: new Date().toISOString(),
      total,
      lineasVenta: lineasVenta.map(linea => ({
        producto: { idProducto: linea.producto.idProducto },
        cantidad: linea.cantidad,
        precioUnitario: linea.precioUnitario,
        subtotal: linea.subtotal
      }))
    };

    try {
      const response = await addVenta(nuevaVenta);
      if (response && response.status >= 200 && response.status < 300) {
        Swal.fire('Éxito', 'Venta registrada correctamente.', 'success');
        setShowModal(false);
        setSelectedCliente('');
        setLineasVenta([]);
        setTotal(0);
        const ventasData = await getVentas();
        setVentas(ventasData);
      } else {
        Swal.fire('Error', 'Hubo un problema al registrar la venta.', 'error');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        if (error.response.data.message && error.response.data.message.includes("Stock insuficiente para el producto")) {
          Swal.fire('Error', error.response.data.message, 'error');
        } else {
          Swal.fire('Error', 'Hubo un problema al registrar la venta.', 'error');
        }
      } else {
        Swal.fire('Error', 'Hubo un problema al registrar la venta.', 'error');
      }
    }
  };

  const handleDeleteVenta = async (idVenta) => {
    try {
      await deleteVenta(idVenta);
      Swal.fire('Éxito', 'Venta eliminada correctamente.', 'success');
      const ventasData = await getVentas();
      setVentas(ventasData);
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al eliminar la venta.', 'error');
    }
  };

  const handleShowDetail = (venta) => {
    setSelectedVenta(venta);
    setShowDetailModal(true);
  };

  const handleGeneratePDF = (venta) => {
    const doc = new jsPDF();
    doc.text(`Detalles de la Venta #${venta.idVenta}`, 10, 10);
    doc.text(`Cliente: ${venta.cliente.nombre} ${venta.cliente.apellido}`, 10, 20);
    doc.text(`Vendedor: ${venta.usuario.nombre} ${venta.usuario.apellido}`, 10, 30);
    doc.text(`Total: $${venta.total}`, 10, 40);

    const lineas = venta.lineasVenta.map(linea => [
      linea.producto.nombre,
      linea.cantidad,
      `$${linea.precioUnitario}`,
      `$${linea.subtotal}`
    ]);

    doc.autoTable({
      head: [['Producto', 'Cantidad', 'Precio Unitario', 'Subtotal']],
      body: lineas,
      startY: 50
    });

    doc.save(`venta_${venta.idVenta}.pdf`);
  };

  const filteredProductos = productos.filter(prod =>
    prod.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ventas-container">
      <Header />
      <div className="container mt-5">
        <h2>Registrar Nueva Venta</h2>
        <Button className="mb-3" onClick={() => setShowModal(true)}>Crear Nueva Venta</Button>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Crear Nueva Venta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="clienteSelect">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCliente}
                  onChange={(e) => setSelectedCliente(e.target.value)}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombre} {cliente.apellido}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="searchInput" className="mt-3">
                <Form.Label>Buscar Producto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre, descripción, código o categoría"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="productoSelect" className="mt-3">
                <Form.Label>Producto</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                >
                  <option value="">Seleccione un producto</option>
                  {filteredProductos.map(producto => (
                    <option key={producto.idProducto} value={producto.idProducto}>
                      {producto.nombre} - ${producto.precio} ({producto.categoria?.nombre || 'Sin Categoría'})
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="cantidadInput" className="mt-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddProducto} className="mt-3">
                Agregar Producto
              </Button>

              <h5 className="mt-4">Productos Agregados</h5>
              <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineasVenta.map((linea, index) => (
                      <tr key={index}>
                        <td>{linea.producto.nombre}</td>
                        <td>{linea.cantidad}</td>
                        <td>${linea.precioUnitario}</td>
                        <td>${linea.subtotal}</td>
                        <td>
                          <Button variant="danger" onClick={() => handleRemoveProducto(index)}>
                            Quitar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <h5>Total: ${total.toFixed(2)}</h5>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveVenta}>Guardar Venta</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalle de la Venta #{selectedVenta?.idVenta}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedVenta && (
              <>
                <p><strong>Cliente:</strong> {selectedVenta.cliente.nombre} {selectedVenta.cliente.apellido}</p>
                <p><strong>Vendedor:</strong> {selectedVenta.usuario.nombre} {selectedVenta.usuario.apellido}</p>
                <p><strong>Total:</strong> ${selectedVenta.total}</p>
                <h5>Productos</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVenta.lineasVenta.map((linea, index) => (
                      <tr key={index}>
                        <td>{linea.producto.nombre}</td>
                        <td>{linea.cantidad}</td>
                        <td>${linea.precioUnitario}</td>
                        <td>${linea.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Cerrar</Button>
            <Button variant="primary" onClick={() => handleGeneratePDF(selectedVenta)}>Generar PDF</Button>
          </Modal.Footer>
        </Modal>

        <h3 className="mt-5">Últimas Ventas</h3>
        <div className="ventas-cards row justify-content-center">
          {ventas.map(venta => (
            <div key={venta.idVenta} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-3">
              <Card className="venta-card" style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>Venta #{venta.idVenta}</Card.Title>
                  <Card.Text>
                    <strong>Cliente:</strong> {venta.cliente.nombre} {venta.cliente.apellido} <br />
                    <strong>Vendedor:</strong> {venta.usuario.nombre} {venta.usuario.apellido} <br />
                    <strong>Total:</strong> ${venta.total}
                  </Card.Text>
                  <Button variant="info" onClick={() => handleShowDetail(venta)}>Ver Detalle</Button>
                  <Button variant="danger" className="ml-2" onClick={() => handleDeleteVenta(venta.idVenta)}>Eliminar</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Ventas;
