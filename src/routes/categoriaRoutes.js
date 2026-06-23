const { Router } = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = Router();

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.criarCategoria);

module.exports = router;
