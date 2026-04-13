const lancamentoService = require('../services/lancamentoService');

async function listarLancamentos(request, response, next) {
  try {
    const filtros = {
      tipo_lancamento: request.query.tipo_lancamento,
      situacao: request.query.situacao
    };

    const lancamentos = await lancamentoService.listarLancamentos(filtros);
    response.status(200).json(lancamentos);
  } catch (error) {
    next(error);
  }
}

async function buscarLancamentoPorId(request, response, next) {
  try {
    const lancamento = await lancamentoService.buscarLancamentoPorId(Number(request.params.id));
    response.status(200).json(lancamento);
  } catch (error) {
    next(error);
  }
}

async function criarLancamento(request, response, next) {
  try {
    const lancamento = await lancamentoService.criarLancamento(request.body);
    response.status(201).json(lancamento);
  } catch (error) {
    next(error);
  }
}

async function atualizarLancamento(request, response, next) {
  try {
    const lancamento = await lancamentoService.atualizarLancamento(
      Number(request.params.id),
      request.body
    );
    response.status(200).json(lancamento);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarLancamentos,
  buscarLancamentoPorId,
  criarLancamento,
  atualizarLancamento
};
