const lancamentoModel = require('../models/lancamentoModel');

function validarPayloadLancamento(payload) {
  const camposObrigatorios = [
    'descricao',
    'data_lancamento',
    'valor',
    'tipo_lancamento',
    'situacao'
  ];

  for (const campo of camposObrigatorios) {
    if (payload[campo] === undefined || payload[campo] === null || payload[campo] === '') {
      const error = new Error(`O campo ${campo} e obrigatorio.`);
      error.statusCode = 400;
      throw error;
    }
  }
}

async function listarLancamentos(filtros) {
  return lancamentoModel.listarTodos(filtros);
}

async function buscarLancamentoPorId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Id de lancamento invalido.');
    error.statusCode = 400;
    throw error;
  }

  const lancamento = await lancamentoModel.buscarPorId(id);

  if (!lancamento) {
    const error = new Error('Lancamento nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return lancamento;
}

async function criarLancamento(payload) {
  validarPayloadLancamento(payload);
  return lancamentoModel.criar(payload);
}

module.exports = {
  listarLancamentos,
  buscarLancamentoPorId,
  criarLancamento
};
