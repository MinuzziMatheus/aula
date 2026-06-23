const categoriaModel = require('../models/categoriaModel');

async function listarCategorias() {
  return categoriaModel.listarTodas();
}

async function criarCategoria(payload) {
  if (!payload.nome) {
    const error = new Error('O campo nome e obrigatorio.');
    error.statusCode = 400;
    throw error;
  }
  return categoriaModel.criar(payload);
}

module.exports = { listarCategorias, criarCategoria };
