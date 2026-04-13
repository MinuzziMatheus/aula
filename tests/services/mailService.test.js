describe('mailService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('15. nao deve enviar email quando MAIL_ENABLED estiver desabilitado', async () => {
    jest.doMock('../../src/config/env', () => ({
      mail: { enabled: false }
    }));
    const createTransport = jest.fn();
    jest.doMock('nodemailer', () => ({
      createTransport
    }));

    const mailService = require('../../src/services/mailService');

    await expect(
      mailService.enviarEmailLancamento({
        operacao: 'criado',
        lancamento: { id: 1, descricao: 'Teste', data_lancamento: '2026-04-13', valor: 10, tipo_lancamento: 'RECEITA', situacao: 'PAGO' }
      })
    ).resolves.toBeUndefined();

    expect(createTransport).not.toHaveBeenCalled();
  });

  test('16. deve enviar email quando configuracao estiver completa', async () => {
    const sendMail = jest.fn().mockResolvedValue({});
    const createTransport = jest.fn(() => ({ sendMail }));

    jest.doMock('../../src/config/env', () => ({
      mail: {
        enabled: true,
        host: 'smtp.exemplo.com',
        port: 587,
        user: 'user',
        password: 'pass',
        from: 'from@exemplo.com',
        to: 'to@exemplo.com',
        secure: false
      }
    }));
    jest.doMock('nodemailer', () => ({
      createTransport
    }));

    const mailService = require('../../src/services/mailService');

    await mailService.enviarEmailLancamento({
      operacao: 'criado',
      lancamento: {
        id: 1,
        descricao: 'Teste email',
        data_lancamento: '2026-04-13',
        valor: 50,
        tipo_lancamento: 'RECEITA',
        situacao: 'PAGO'
      }
    });

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.exemplo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user',
        pass: 'pass'
      }
    });
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: 'from@exemplo.com',
      to: 'to@exemplo.com',
      subject: 'Lancamento criado: Teste email'
    }));
  });

  test('17. deve falhar quando configuracao de email estiver incompleta', async () => {
    jest.doMock('../../src/config/env', () => ({
      mail: {
        enabled: true,
        host: '',
        port: 587,
        user: 'user',
        password: 'pass',
        from: 'from@exemplo.com',
        to: 'to@exemplo.com',
        secure: false
      }
    }));
    jest.doMock('nodemailer', () => ({
      createTransport: jest.fn()
    }));

    const mailService = require('../../src/services/mailService');

    await expect(
      mailService.enviarEmailLancamento({
        operacao: 'criado',
        lancamento: {
          id: 1,
          descricao: 'Teste email',
          data_lancamento: '2026-04-13',
          valor: 50,
          tipo_lancamento: 'RECEITA',
          situacao: 'PAGO'
        }
      })
    ).rejects.toMatchObject({
      message: 'Configuracao de email incompleta. Defina MAIL_HOST no .env.'
    });
  });
});
