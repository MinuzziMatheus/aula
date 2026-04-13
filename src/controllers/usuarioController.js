const usuarioService = require('../services/usuarioService');

async function listarUsuarios(_request, response, next) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    response.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function buscarUsuarioPorId(request, response, next) {
  try {
    const usuario = await usuarioService.buscarUsuarioPorId(Number(request.params.id));
    response.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function criarUsuario(request, response, next) {
  try {
    const usuario = await usuarioService.criarUsuario(request.body);
    response.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario
};
