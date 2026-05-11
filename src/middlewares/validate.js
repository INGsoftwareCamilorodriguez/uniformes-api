// src/middlewares/validate.js
// Middleware para manejar errores de express-validator

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Error de validación',
      errores: errors.array().map(e => ({ campo: e.path, mensaje: e.msg })),
    });
  }
  next();
};

module.exports = validate;
