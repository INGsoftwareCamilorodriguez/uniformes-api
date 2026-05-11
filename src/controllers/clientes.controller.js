// src/controllers/clientes.controller.js

const { pool } = require('../config/db');

// GET /api/clientes
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY apellido, nombre');
    res.json({ ok: true, total: rows.length, datos: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener clientes', error: err.message });
  }
};

// GET /api/clientes/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    res.json({ ok: true, datos: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener cliente', error: err.message });
  }
};

// POST /api/clientes
const create = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, apellido, email, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, telefono || null, direccion || null]
    );
    res.status(201).json({ ok: true, mensaje: 'Cliente registrado', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ ok: false, mensaje: 'El email ya está registrado' });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al registrar cliente', error: err.message });
  }
};

// PUT /api/clientes/:id
const update = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion } = req.body;
    const [result] = await pool.query(
      'UPDATE clientes SET nombre=?, apellido=?, email=?, telefono=?, direccion=? WHERE id=?',
      [nombre, apellido, email, telefono || null, direccion || null, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    res.json({ ok: true, mensaje: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar cliente', error: err.message });
  }
};

// DELETE /api/clientes/:id
const remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    res.json({ ok: true, mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar cliente', error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
