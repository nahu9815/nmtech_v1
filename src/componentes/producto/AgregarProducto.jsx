import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de guardar
import { getCategorias } from '../services/categoria_service/api';
import { createProducto } from '../services/producto_service/api';
import Header from '../commons/Header';

const AgregarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const navigate = useNavigate(); // Para redirigir

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await getCategorias();
    setCategorias(data);
  };

  const handleFileChange = (e) => {
    setImagenFile(e.target.files[0]);
    setImagenUrl(''); // Limpiar la URL si se elige un archivo local
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageName = '';

    if (imagenFile) {
      // Si se seleccionó un archivo local, subirlo al backend
      const formData = new FormData();
      formData.append('file', imagenFile);

      try {
        const response = await axios.post('http://localhost:8080/productos/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageName = response.data; // Nombre de la imagen subida
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        return;
      }
    } else if (imagenUrl) {
      // Si es una URL de imagen, la usamos directamente
      imageName = imagenUrl;
    }

    // Preparar los datos del producto
    const productoData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen: imageName, // Guardamos el nombre del archivo o la URL
      idCategoria: categoriaId,
    };

    // Llamar al servicio para crear el producto
    await createProducto(productoData);

    // Mostrar alerta de éxito con SweetAlert
    Swal.fire({
      title: 'Producto agregado',
      text: 'El producto ha sido agregado con éxito.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      // Redirigir a la lista de productos
      navigate('/products');
    });
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1>Agregar Nuevo Producto</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              className="form-control"
              id="descripcion"
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              className="form-control"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="categoria">Categoría</label>
            <select
              className="form-control"
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Seleccionar Categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mt-3">
            <label htmlFor="imagen">Subir Imagen del Producto</label>
            <input
              type="file"
              className="form-control"
              id="imagen"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="imagenUrl">O ingresar URL de la Imagen</label>
            <input
              type="text"
              className="form-control"
              id="imagenUrl"
              value={imagenUrl}
              onChange={(e) => {
                setImagenUrl(e.target.value);
                setImagenFile(null); // Limpiar archivo si se selecciona URL
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Agregar Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarProducto;
