const pdfService = require('../../src/services/pdfService');

describe('pdfService', () => {
  test('18. deve gerar buffer pdf sem lancamentos', async () => {
    const buffer = await pdfService.gerarPdfLancamentos([]);

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });

  test('19. deve gerar buffer pdf com lancamentos', async () => {
    const buffer = await pdfService.gerarPdfLancamentos([
      {
        id: 1,
        descricao: 'Salario',
        data_lancamento: '2026-04-01',
        valor: 5000,
        tipo_lancamento: 'RECEITA',
        situacao: 'PAGO'
      }
    ]);

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
  });
});
