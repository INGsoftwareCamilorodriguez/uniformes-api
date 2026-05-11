// src/routes/categorias.routes.js

const router  = require('express').Router();
const ctrl    = require('../controllers/categorias.controller');
const { body, param } = require('express-validator');
const validate = require('../middlewares/validate');

const idRule     = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');
const bodyRules  = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 100 }),
  body('descripcion').optional().isString(),
];

router.get('/',    ctrl.getAll);
router.get('/:id', [idRule], validate, ctrl.getById);
router.post('/',   [...bodyRules], validate, ctrl.create);
router.put('/:id', [idRule, ...bodyRules], validate, ctrl.update);
router.delete('/:id', [idRule], validate, ctrl.remove);

module.exports = router;
