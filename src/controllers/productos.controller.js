// src/controllers/productos.controller.js

const { pool } = require('../config/db');

// GET /api/productos  (con filtros opcionales: ?categoria_id=&talla=&color=&activo=)
const getAll = async (req, res) => {
  try {
    const { categoria_id, talla, color, activo } = req.query;
    let sql = `
      SELECT p.*, c.nombre AS categoria
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE 1=1
    `;
    const params = [];

    if (categoria_id) { sql += ' AND p.categoria_id = ?'; params.push(categoria_id); }
    if (talla)        { sql += ' AND p.talla = ?';        params.push(talla); }
    if (color)        { sql += ' AND p.color LIKE ?';     params.push(`%${color}%`); }
    if (activo !== undefined) { sql += ' AND p.activo = ?'; params.push(activo); }

    sql += ' ORDER BY c.nombre, p.nombre';

    const [rows] = await pool.query(sql, params);
    res.json({ ok: true, total: rows.length, datos: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener productos', error: err.message });
  }
};

// GET /api/productos/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    res.json({ ok: true, datos: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener producto', error: err.message });
  }
};

// POST /api/productos
const create = async (req, res) => {
  try {
    const { categoria_id, nombre, descripcion, precio, stock, talla, color, imagen_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO productos
         (categoria_id, nombre, descripcion, precio, stock, talla, color, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [categoria_id, nombre, descripcion || null, precio, stock || 0, talla || null, color || null, imagen_url || null]
    );
    res.status(201).json({ ok: true, mensaje: 'Producto creado', id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear producto', error: err.message });
  }
};

// PUT /api/productos/:id
const update = async (req, res) => {
  try {
    const { categoria_id, nombre, descripcion, precio, stock, talla, color, imagen_url, activo } = req.body;
    const [result] = await pool.query(
      `UPDATE productos
       SET categoria_id = ?, nombre = ?, descripcion = ?, precio = ?,
           stock = ?, talla = ?, color = ?, imagen_url = ?, activo = ?
       WHERE id = ?`,
      [categoria_id, nombre, descripcion || null, precio, stock, talla || null, color || null, imagen_url || null, activo ?? 1, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    res.json({ ok: true, mensaje: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar producto', error: err.message });
  }
};

// DELETE /api/productos/:id  (soft delete: activo = 0)
const remove = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE productos SET activo = 0 WHERE id = ?',
      [req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado' });
    res.json({ ok: true, mensaje: 'Producto desactivado (soft delete)' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar producto', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
