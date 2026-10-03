const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./config/db');
const { verifyToken, requireRole } = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_inventario';

// Configuración de Middlewares globales
app.use(cors());
app.use(express.json());

// ==========================================
// RUTAS
// ==========================================

/**
 * POST /api/login
 * Inicia sesión y retorna token con id y role del usuario.
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'El usuario y la contraseña son requeridos.' });
  }

  try {
    const result = await db.query('SELECT id, username, role, password FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];

    // TODO: En producción validar con bcrypt:
    // const match = await bcrypt.compare(password, user.password);
    // if (!match) return res.status(401).json({ message: 'Credenciales inválidas.' });

    // Firma del token JWT con ID y Rol
    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error en POST /api/login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

/**
 * GET /api/products
 * Obtiene la lista completa de productos.
 * Ruta protegida para usuarios autenticados ('root', 'admin', 'user').
 */
app.get('/api/products', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id ASC');
    return res.json(result.rows);
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    return res.status(500).json({ message: 'Error al consultar el catálogo de productos.' });
  }
});

/**
 * POST /api/products
 * Inserta un nuevo producto en la BD.
 * Ruta protegida restringida únicamente a roles 'root' y 'admin'.
 */
app.post('/api/products', verifyToken, requireRole(['root', 'admin']), async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ message: 'Nombre, precio y stock son campos requeridos.' });
  }

  try {
    const insertQuery = `
      INSERT INTO products (name, description, price, stock, category_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [name, description || null, price, stock, category_id || null];

    const result = await db.query(insertQuery, values);

    return res.status(201).json({
      message: 'Producto creado exitosamente.',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    return res.status(500).json({ message: 'Error al registrar el producto en la base de datos.' });
  }
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`[SERVER] API escuchando en el puerto ${PORT}`);
});