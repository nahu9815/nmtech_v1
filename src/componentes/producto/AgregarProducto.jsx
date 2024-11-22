import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategorias } from '../services/categoria_service/api';
import { createProducto, uploadImage } from '../services/producto_service/api'; // Importar el nuevo servicio
import Header from '../commons/Header';
import Swal from 'sweetalert2';

const AgregarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const data = await getCategorias();
    setCategorias(data);
  };

  const handleFileChange = (e) => {
    setImagenFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';

    if (imagenFile) {
      const formData = new FormData();
      formData.append('file', imagenFile);

      try {
        const response = await uploadImage(formData); // Subir la imagen
        imageUrl = response.data; // URL de la imagen devuelta por el backend
      } catch (error) {
        console.error('Error al subir la imagen:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al subir la imagen.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }
    }

    const productoData = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      imagen: imageUrl, // Guardar la URL de la imagen en lugar de los bytes
      idCategoria: categoriaId,
    };

    try {
      await createProducto(productoData);
      Swal.fire({
        title: 'Producto agregado',
        text: 'El producto ha sido agregado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/products');
      });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al agregar el producto.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
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
            <label htmlFor="imagen">Subir Imagen del Producto (opcional)</label>
            <input
              type="file"
              className="form-control"
              id="imagen"
              accept="image/*"
              onChange={handleFileChange}
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
