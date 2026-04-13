jest.mock('../../src/models/lancamentoModel', () => ({
  listarTodos: jest.fn(),
  buscarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn()
}));

jest.mock('../../src/services/mailService', () => ({
  enviarEmailLancamento: jest.fn()
}));

jest.mock('../../src/services/pdfService', () => ({
  gerarPdfLancamentos: jest.fn()
}));

const lancamentoModel = require('../../src/models/lancamentoModel');
const mailService = require('../../src/services/mailService');
const pdfService = require('../../src/services/pdfService');
const lancamentoService = require('../../src/services/lancamentoService');

describe('lancamentoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. deve listar lancamentos com filtros validos', async () => {
    const filtros = { data_inicial: '2026-04-01', situacao: 'PAGO' };
    const lancamentos = [{ id: 1 }];
    lancamentoModel.listarTodos.mockResolvedValue(lancamentos);

    const resultado = await lancamentoService.listarLancamentos(filtros);

    expect(lancamentoModel.listarTodos).toHaveBeenCalledWith(filtros);
    expect(resultado).toEqual(lancamentos);
  });

  test('2. deve rejeitar data_inicial invalida', async () => {
    await expect(
      lancamentoService.listarLancamentos({ data_inicial: 'data-errada' })
    ).rejects.toMatchObject({ message: 'Filtro data_inicial invalido. Use o formato YYYY-MM-DD.' });
  });

  test('3. deve rejeitar data_final invalida', async () => {
    await expect(
      lancamentoService.listarLancamentos({ data_final: 'ontem' })
    ).rejects.toMatchObject({ message: 'Filtro data_final invalido. Use o formato YYYY-MM-DD.' });
  });

  test('4. deve rejeitar periodo invertido', async () => {
    await expect(
      lancamentoService.listarLancamentos({
        data_inicial: '2026-04-20',
        data_final: '2026-04-10'
      })
    ).rejects.toMatchObject({
      message: 'Filtro de periodo invalido. data_inicial nao pode ser maior que data_final.'
    });
  });

  test('5. deve rejeitar busca por id invalido', async () => {
    await expect(lancamentoService.buscarLancamentoPorId(0)).rejects.toMatchObject({
      message: 'Id de lancamento invalido.'
    });
  });

  test('6. deve retornar erro quando lancamento nao existir', async () => {
    lancamentoModel.buscarPorId.mockResolvedValue(null);

    await expect(lancamentoService.buscarLancamentoPorId(1)).rejects.toMatchObject({
      message: 'Lancamento nao encontrado.'
    });
  });

  test('7. deve criar lancamento e enviar email', async () => {
    const payload = {
      descricao: 'Teste',
      data_lancamento: '2026-04-13',
      valor: 100,
      tipo_lancamento: 'RECEITA',
      situacao: 'PAGO'
    };
    const retorno = { id: 1, ...payload };
    lancamentoModel.criar.mockResolvedValue(retorno);

    const resultado = await lancamentoService.criarLancamento(payload);

    expect(lancamentoModel.criar).toHaveBeenCalledWith(payload);
    expect(mailService.enviarEmailLancamento).toHaveBeenCalledWith({
      operacao: 'criado',
      lancamento: retorno
    });
    expect(resultado).toEqual(retorno);
  });

  test('8. deve atualizar lancamento e enviar email', async () => {
    const payload = {
      descricao: 'Atualizado',
      data_lancamento: '2026-04-14',
      valor: 200,
      tipo_lancamento: 'DESPESA',
      situacao: 'PENDENTE'
    };
    const retorno = { id: 2, ...payload };
    lancamentoModel.buscarPorId.mockResolvedValue({ id: 2 });
    lancamentoModel.atualizar.mockResolvedValue(retorno);

    const resultado = await lancamentoService.atualizarLancamento(2, payload);

    expect(lancamentoModel.buscarPorId).toHaveBeenCalledWith(2);
    expect(lancamentoModel.atualizar).toHaveBeenCalledWith(2, payload);
    expect(mailService.enviarEmailLancamento).toHaveBeenCalledWith({
      operacao: 'atualizado',
      lancamento: retorno
    });
    expect(resultado).toEqual(retorno);
  });

  test('9. deve exportar lancamentos em pdf', async () => {
    const filtros = { situacao: 'PAGO' };
    const lancamentos = [{ id: 1 }];
    const pdfBuffer = Buffer.from('pdf');
    lancamentoModel.listarTodos.mockResolvedValue(lancamentos);
    pdfService.gerarPdfLancamentos.mockResolvedValue(pdfBuffer);

    const resultado = await lancamentoService.exportarLancamentosPdf(filtros);

    expect(lancamentoModel.listarTodos).toHaveBeenCalledWith(filtros);
    expect(pdfService.gerarPdfLancamentos).toHaveBeenCalledWith(lancamentos);
    expect(resultado).toBe(pdfBuffer);
  });
});
