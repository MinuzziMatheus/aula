const categoriaService = require('../services/categoriaService');

async function listarCategorias(_request, response, next) {
  try {
    const categorias = await categoriaService.listarCategorias();
    response.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

async function criarCategoria(request, response, next) {
  try {
    const categoria = await categoriaService.criarCategoria(request.body);
    response.status(201).json(categoria);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarCategorias, criarCategoria };
