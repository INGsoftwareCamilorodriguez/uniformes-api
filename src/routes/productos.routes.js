// src/routes/productos.routes.js

const router   = require('express').Router();
const ctrl     = require('../controllers/productos.controller');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');

const idRule = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');

const bodyRules = [
  body('categoria_id').isInt({ min: 1 }).withMessage('categoria_id debe ser un entero positivo'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 150 }),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un entero >= 0'),
  body('talla').optional().isString().isLength({ max: 20 }),
  body('color').optional().isString().isLength({ max: 60 }),
  body('imagen_url').optional().isURL().withMessage('imagen_url debe ser una URL válida'),
  body('activo').optional().isBoolean(),
];

router.get('/',    ctrl.getAll);
router.get('/:id', [idRule], validate, ctrl.getById);
router.post('/',   [...bodyRules], validate, ctrl.create);
router.put('/:id', [idRule, ...bodyRules], validate, ctrl.update);
router.delete('/:id', [idRule], validate, ctrl.remove);

module.exports = router;
