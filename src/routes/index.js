const { Router } = require('express');
const usuarioRoutes = require('./usuarioRoutes');
const lancamentoRoutes = require('./lancamentoRoutes');
const categoriaRoutes = require('./categoriaRoutes');

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/lancamentos', lancamentoRoutes);
router.use('/categorias', categoriaRoutes);

module.exports = router;
