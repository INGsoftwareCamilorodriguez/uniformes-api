// src/index.js
// Punto de entrada principal — API de Uniformes Escolares

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { testConnection } = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ─────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ────────────────────────────────────────────
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/productos',  require('./routes/productos.routes'));
app.use('/api/clientes',   require('./routes/clientes.routes'));
app.use('/api/pedidos',    require('./routes/pedidos.routes'));

// ── Ruta raíz / documentación básica ────────────────
app.get('/', (req, res) => {
  res.json({
    nombre:   'Uniformes escolares',
    version:  '1.0.0',
    proyecto: 'proyecto de las confecciones maty',
    rutas: {
      categorias: '/api/categorias',
      productos:  '/api/productos',
      clientes:   '/api/clientes',
      pedidos:    '/api/pedidos',
    },
  });
});

// ── 404 handler ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta ${req.method} ${req.path} no encontrada` });
});

// ── Error handler global ─────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor', error: err.message });
});

// ── Iniciar servidor ─────────────────────────────────
(async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 Documentación: http://localhost:${PORT}/`);
  });
})();
