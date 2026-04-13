const lancamentoModel = require('../models/lancamentoModel');
const mailService = require('./mailService');
const pdfService = require('./pdfService');

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

function validarFiltrosLancamento(filtros = {}) {
  const { data_inicial, data_final } = filtros;

  if (data_inicial && Number.isNaN(Date.parse(data_inicial))) {
    const error = new Error('Filtro data_inicial invalido. Use o formato YYYY-MM-DD.');
    error.statusCode = 400;
    throw error;
  }

  if (data_final && Number.isNaN(Date.parse(data_final))) {
    const error = new Error('Filtro data_final invalido. Use o formato YYYY-MM-DD.');
    error.statusCode = 400;
    throw error;
  }

  if (data_inicial && data_final && new Date(data_inicial) > new Date(data_final)) {
    const error = new Error('Filtro de periodo invalido. data_inicial nao pode ser maior que data_final.');
    error.statusCode = 400;
    throw error;
  }
}

async function listarLancamentos(filtros) {
  validarFiltrosLancamento(filtros);
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
  const lancamento = await lancamentoModel.criar(payload);
  await mailService.enviarEmailLancamento({
    operacao: 'criado',
    lancamento
  });

  return lancamento;
}

async function atualizarLancamento(id, payload) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Id de lancamento invalido.');
    error.statusCode = 400;
    throw error;
  }

  validarPayloadLancamento(payload);

  const existente = await lancamentoModel.buscarPorId(id);

  if (!existente) {
    const error = new Error('Lancamento nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const lancamento = await lancamentoModel.atualizar(id, payload);
  await mailService.enviarEmailLancamento({
    operacao: 'atualizado',
    lancamento
  });

  return lancamento;
}

async function exportarLancamentosPdf(filtros) {
  validarFiltrosLancamento(filtros);
  const lancamentos = await lancamentoModel.listarTodos(filtros);
  return pdfService.gerarPdfLancamentos(lancamentos);
}

module.exports = {
  listarLancamentos,
  buscarLancamentoPorId,
  criarLancamento,
  atualizarLancamento,
  exportarLancamentosPdf
};
