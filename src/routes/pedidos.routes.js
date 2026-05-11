// src/routes/pedidos.routes.js

const router   = require('express').Router();
const ctrl     = require('../controllers/pedidos.controller');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');

const idRule = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');

const createRules = [
  body('cliente_id').isInt({ min: 1 }).withMessage('cliente_id debe ser un entero positivo'),
  body('items').isArray({ min: 1 }).withMessage('items debe ser un arreglo con al menos 1 elemento'),
  body('items.*.producto_id').isInt({ min: 1 }).withMessage('Cada item debe tener producto_id válido'),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser >= 1'),
];

const estadoRules = [
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'])
    .withMessage('Estado inválido'),
];

router.get('/',             ctrl.getAll);
router.get('/:id',          [idRule], validate, ctrl.getById);
router.post('/',            [...createRules], validate, ctrl.create);
router.patch('/:id/estado', [idRule, ...estadoRules], validate, ctrl.updateEstado);

module.exports = router;
