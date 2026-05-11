// src/controllers/categorias.controller.js

const { pool } = require('../config/db');

// GET /api/categorias
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    res.json({ ok: true, total: rows.length, datos: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener categorías', error: err.message });
  }
};

// GET /api/categorias/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ ok: false, mensaje: 'Categoría no encontrada' });
    res.json({ ok: true, datos: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener categoría', error: err.message });
  }
};

// POST /api/categorias
const create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    res.status(201).json({ ok: true, mensaje: 'Categoría creada', id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear categoría', error: err.message });
  }
};

// PUT /api/categorias/:id
const update = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Categoría no encontrada' });
    res.json({ ok: true, mensaje: 'Categoría actualizada' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar categoría', error: err.message });
  }
};

// DELETE /api/categorias/:id
const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Categoría no encontrada' });
    res.json({ ok: true, mensaje: 'Categoría eliminada' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar categoría', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
