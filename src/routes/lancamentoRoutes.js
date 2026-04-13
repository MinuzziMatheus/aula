const { Router } = require('express');
const lancamentoController = require('../controllers/lancamentoController');

const router = Router();

router.get('/', lancamentoController.listarLancamentos);
router.get('/:id', lancamentoController.buscarLancamentoPorId);
router.post('/', lancamentoController.criarLancamento);

module.exports = router;
