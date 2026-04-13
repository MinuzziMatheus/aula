const { Router } = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = Router();

router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.post('/', usuarioController.criarUsuario);

module.exports = router;
