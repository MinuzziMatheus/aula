const PDFDocument = require('pdfkit');

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function formatarValor(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function gerarLinhaLancamento(doc, lancamento) {
  doc
    .fontSize(11)
    .text(`ID: ${lancamento.id}`)
    .text(`Descricao: ${lancamento.descricao}`)
    .text(`Data: ${formatarData(lancamento.data_lancamento)}`)
    .text(`Valor: ${formatarValor(lancamento.valor)}`)
    .text(`Tipo: ${lancamento.tipo_lancamento}`)
    .text(`Situacao: ${lancamento.situacao}`)
    .moveDown();
}

function gerarPdfLancamentos(lancamentos) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc
      .fontSize(18)
      .text('Relatorio de Lancamentos', { align: 'center' })
      .moveDown()
      .fontSize(11)
      .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`)
      .moveDown();

    if (lancamentos.length === 0) {
      doc.text('Nenhum lancamento encontrado para exportacao.');
    } else {
      lancamentos.forEach((lancamento, index) => {
        gerarLinhaLancamento(doc, lancamento);

        if (index < lancamentos.length - 1) {
          doc
            .moveTo(40, doc.y)
            .lineTo(555, doc.y)
            .strokeColor('#999999')
            .stroke()
            .moveDown();
        }
      });
    }

    doc.end();
  });
}

module.exports = {
  gerarPdfLancamentos
};
