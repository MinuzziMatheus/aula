const nodemailer = require('nodemailer');
const env = require('../config/env');

function validarConfiguracaoEmail() {
  const camposObrigatorios = ['host', 'port', 'user', 'password', 'from', 'to'];

  for (const campo of camposObrigatorios) {
    if (!env.mail[campo]) {
      const error = new Error(
        `Configuracao de email incompleta. Defina MAIL_${campo.toUpperCase()} no .env.`
      );
      error.statusCode = 500;
      throw error;
    }
  }
}

function criarTransporter() {
  validarConfiguracaoEmail();

  return nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: {
      user: env.mail.user,
      pass: env.mail.password
    }
  });
}

function montarTextoEmail({ operacao, lancamento }) {
  return [
    `Um lancamento foi ${operacao}.`,
    '',
    `ID: ${lancamento.id}`,
    `Descricao: ${lancamento.descricao}`,
    `Data: ${new Date(lancamento.data_lancamento).toISOString().slice(0, 10)}`,
    `Valor: ${lancamento.valor}`,
    `Tipo: ${lancamento.tipo_lancamento}`,
    `Situacao: ${lancamento.situacao}`
  ].join('\n');
}

async function enviarEmailLancamento({ operacao, lancamento }) {
  if (!env.mail.enabled) {
    return;
  }

  const transporter = criarTransporter();

  await transporter.sendMail({
    from: env.mail.from,
    to: env.mail.to,
    subject: `Lancamento ${operacao}: ${lancamento.descricao}`,
    text: montarTextoEmail({ operacao, lancamento })
  });
}

module.exports = {
  enviarEmailLancamento
};
