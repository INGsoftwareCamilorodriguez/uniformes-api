// src/controllers/pedidos.controller.js

const { pool } = require('../config/db');

// GET /api/pedidos
const getAll = async (req, res) => {
  try {
    const { estado, cliente_id } = req.query;
    let sql = `
      SELECT p.id, p.total, p.estado, p.creado_en,
             CONCAT(c.nombre, ' ', c.apellido) AS cliente, c.email
      FROM pedidos p
      JOIN clientes c ON c.id = p.cliente_id
      WHERE 1=1
    `;
    const params = [];
    if (estado)     { sql += ' AND p.estado = ?';     params.push(estado); }
    if (cliente_id) { sql += ' AND p.cliente_id = ?'; params.push(cliente_id); }
    sql += ' ORDER BY p.creado_en DESC';

    const [rows] = await pool.query(sql, params);
    res.json({ ok: true, total: rows.length, datos: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener pedidos', error: err.message });
  }
};

// GET /api/pedidos/:id  (incluye detalle)
const getById = async (req, res) => {
  try {
    const [[pedido]] = await pool.query(
      `SELECT p.*, CONCAT(c.nombre, ' ', c.apellido) AS cliente, c.email, c.telefono
       FROM pedidos p JOIN clientes c ON c.id = p.cliente_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!pedido) return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });

    const [detalle] = await pool.query(
      `SELECT dp.*, pr.nombre AS producto, pr.talla, pr.color
       FROM detalle_pedidos dp
       JOIN productos pr ON pr.id = dp.producto_id
       WHERE dp.pedido_id = ?`,
      [req.params.id]
    );

    res.json({ ok: true, datos: { ...pedido, detalle } });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener pedido', error: err.message });
  }
};

// POST /api/pedidos  — crea pedido con transacción y descuenta stock
const create = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { cliente_id, items } = req.body;
    // items = [{ producto_id, cantidad }]

    // Verificar que el cliente existe
    const [[cliente]] = await conn.query('SELECT id FROM clientes WHERE id = ?', [cliente_id]);
    if (!cliente) {
      await conn.rollback();
      return res.status(404).json({ ok: false, mensaje: 'Cliente no encontrado' });
    }

    let total = 0;
    const detalles = [];

    for (const item of items) {
      const [[prod]] = await conn.query(
        'SELECT id, precio, stock, activo FROM productos WHERE id = ? FOR UPDATE',
        [item.producto_id]
      );
      if (!prod || !prod.activo) {
        await conn.rollback();
        return res.status(404).json({ ok: false, mensaje: `Producto ${item.producto_id} no disponible` });
      }
      if (prod.stock < item.cantidad) {
        await conn.rollback();
        return res.status(400).json({
          ok: false,
          mensaje: `Stock insuficiente para producto ${item.producto_id}. Disponible: ${prod.stock}`
        });
      }
      const subtotal = prod.precio * item.cantidad;
      total += subtotal;
      detalles.push({ producto_id: item.producto_id, cantidad: item.cantidad, precio_unit: prod.precio });

      // Descontar stock
      await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [item.cantidad, item.producto_id]);
    }

    // Crear pedido
    const [{ insertId: pedido_id }] = await conn.query(
      'INSERT INTO pedidos (cliente_id, total) VALUES (?, ?)',
      [cliente_id, total]
    );

    // Insertar detalles
    for (const d of detalles) {
      await conn.query(
        'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unit) VALUES (?, ?, ?, ?)',
        [pedido_id, d.producto_id, d.cantidad, d.precio_unit]
      );
    }

    await conn.commit();
    res.status(201).json({ ok: true, mensaje: 'Pedido creado exitosamente', id: pedido_id, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ ok: false, mensaje: 'Error al crear pedido', error: err.message });
  } finally {
    conn.release();
  }
};

// PATCH /api/pedidos/:id/estado
const updateEstado = async (req, res) => {
  try {
    const estadosValidos = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
    const { estado } = req.body;
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ ok: false, mensaje: `Estado inválido. Válidos: ${estadosValidos.join(', ')}` });
    }
    const [result] = await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ ok: false, mensaje: 'Pedido no encontrado' });
    res.json({ ok: true, mensaje: `Estado actualizado a "${estado}"` });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar estado', error: err.message });
  }
};

module.exports = { getAll, getById, create, updateEstado };
