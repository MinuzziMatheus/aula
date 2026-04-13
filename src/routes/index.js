const { Router } = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const lancamentoRoutes = require('./lancamentoRoutes');

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/lancamentos', lancamentoRoutes);

module.exports = router;
