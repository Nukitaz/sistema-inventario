const { Pool } = require('pg');
require('dotenv').config();

// Configuración del Pool de conexiones PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER || process.env.DB_USER,
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DB || process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432', 10),
});

pool.on('connect', () => {
  console.log('[DB] Conexión establecida con la base de datos PostgreSQL.');
});

pool.on('error', (err) => {
  console.error('[DB Error] Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};