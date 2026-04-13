jest.mock('../../src/services/lancamentoService', () => ({
  exportarLancamentosPdf: jest.fn()
}));

jest.mock('../../src/services/usuarioService', () => ({
  listarUsuarios: jest.fn()
}));

const lancamentoService = require('../../src/services/lancamentoService');
const lancamentoController = require('../../src/controllers/lancamentoController');

function criarResponseMock() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn()
  };
}

describe('controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('20. deve exportar pdf no controller de lancamentos', async () => {
    const request = {
      query: {
        data_inicial: '2026-04-01',
        data_final: '2026-04-30',
        tipo_lancamento: 'RECEITA',
        situacao: 'PAGO'
      }
    };
    const response = criarResponseMock();
    const next = jest.fn();
    const pdfBuffer = Buffer.from('pdf');
    lancamentoService.exportarLancamentosPdf.mockResolvedValue(pdfBuffer);

    await lancamentoController.exportarLancamentosPdf(request, response, next);

    expect(lancamentoService.exportarLancamentosPdf).toHaveBeenCalledWith(request.query);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(pdfBuffer);
    expect(next).not.toHaveBeenCalled();
  });
});
