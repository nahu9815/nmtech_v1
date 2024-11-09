import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import Header from '../commons/Header';
import { deleteProducto, getProductos } from '../services/producto_service/api'; // Cambié a getProductos para obtener todos los productos inicialmente
import Swal from 'sweetalert2';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [filteredProductos, setFilteredProductos] = useState([]); // Estado para productos filtrados
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    fetchProductos(); // Cargar productos al montar el componente
  }, []);

  // Obtener la lista de productos
  const fetchProductos = async () => {
    const data = await getProductos(); // Obtener todos los productos
    setProductos(data);
    setFilteredProductos(data); // Iniciar la lista filtrada con todos los productos
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      await deleteProducto(id);
      fetchProductos(); // Recargar productos después de eliminar
    }
  };

  // Filtrar productos en tiempo real
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = productos.filter((producto) => 
      producto.idProducto.toString().includes(e.target.value) ||
      producto.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProductos(filtered);
  };

  const getImageSrc = (imagePath) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `/images/${imagePath}`;
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1>Gestión de Productos</h1>

        {/* Buscador */}
        <form className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, Nombre o Descripción"
              value={searchTerm}
              onChange={handleSearch} // Filtrar productos al escribir
            />
          </div>
        </form>

        <div className="d-flex justify-content-between mb-3">
          <h4>Lista de Productos</h4>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/addproduct')} // Redireccionar a /addproduct
          >
            Agregar Producto
          </button>
        </div>

        {/* Envolvemos la tabla en una clase `table-responsive` para hacerlo responsive */}
        <div className="table-responsive">
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.length > 0 ? (
                filteredProductos.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>{producto.idProducto}</td>
                    <td>
                      <img
                        src={getImageSrc(producto.imagen)}
                        alt={producto.nombre}
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => navigate(`/editproduct/${producto.idProducto}`)} // Redirigir a edición
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(producto.idProducto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No hay productos disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div> {/* Fin de la clase table-responsive */}
      </div>
    </div>
  );
};

export default Productos;
