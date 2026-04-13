const usuarioModel = require('../models/usuarioModel');

function validarPayloadUsuario(payload) {
  const camposObrigatorios = ['nome', 'login', 'senha', 'situacao'];

  for (const campo of camposObrigatorios) {
    if (!payload[campo]) {
      const error = new Error(`O campo ${campo} e obrigatorio.`);
      error.statusCode = 400;
      throw error;
    }
  }
}

async function listarUsuarios() {
  return usuarioModel.listarTodos();
}

async function buscarUsuarioPorId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Id de usuario invalido.');
    error.statusCode = 400;
    throw error;
  }

  const usuario = await usuarioModel.buscarPorId(id);

  if (!usuario) {
    const error = new Error('Usuario nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return usuario;
}

async function criarUsuario(payload) {
  validarPayloadUsuario(payload);
  return usuarioModel.criar(payload);
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario
};
