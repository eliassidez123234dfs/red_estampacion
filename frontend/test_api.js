// Script de prueba para verificar la conexión con la API
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function testConnection() {
  try {
    console.log('Probando conexión con la API...');
    
    const response = await api.get('/productos/');
    
    console.log('¡Conexión exitosa!');
    console.log(`Productos encontrados: ${response.data.count}`);
    
    console.log('\nPrimeros 3 productos:');
    response.data.results.slice(0, 3).forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre}`);
      console.log(`   Precio: $${producto.precio_base}`);
      console.log(`   Imagen: ${producto.imagen_principal ? 'Sí' : 'No'}`);
      console.log(`   Variantes: ${producto.variantes_count}`);
      console.log('');
    });
    
    return true;
  } catch (error) {
    console.error('Error de conexión:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

testConnection();
