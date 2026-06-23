const API = '/api';

// Navegação
document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const page = this.dataset.page;

    document.querySelectorAll('.nav-links a').forEach(function (l) { l.classList.remove('active'); });
    this.classList.add('active');

    document.querySelectorAll('.page').forEach(function (p) { p.classList.add('hidden'); });
    document.getElementById('page-' + page).classList.remove('hidden');
  });
});

// === LANÇAMENTOS ===

function formatarData(dataISO) {
  const d = new Date(dataISO);
  const dia = String(d.getUTCDate()).padStart(2, '0');
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const ano = d.getUTCFullYear();
  return dia + '/' + mes + '/' + ano;
}

function formatarValor(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function carregarLancamentos() {
  const tipo = document.getElementById('filtro-tipo').value;
  const situacao = document.getElementById('filtro-situacao').value;

  const params = new URLSearchParams();
  if (tipo) params.append('tipo_lancamento', tipo);
  if (situacao) params.append('situacao', situacao);

  let url = API + '/lancamentos';
  if (params.toString()) url += '?' + params.toString();

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (lancamentos) {
      const tbody = document.querySelector('#tabela-lancamentos tbody');
      tbody.innerHTML = '';

      lancamentos.forEach(function (l) {
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + l.id + '</td>' +
          '<td>' + l.descricao + '</td>' +
          '<td>' + formatarData(l.data_lancamento) + '</td>' +
          '<td>' + formatarValor(l.valor) + '</td>' +
          '<td><span class="tag tag-' + l.tipo_lancamento.toLowerCase() + '">' + l.tipo_lancamento + '</span></td>' +
          '<td><span class="tag tag-' + l.situacao.toLowerCase() + '">' + l.situacao + '</span></td>' +
          '<td><button class="btn btn-edit" data-id="' + l.id + '">Editar</button></td>';
        tbody.appendChild(tr);
      });
    });
}

document.getElementById('btn-filtrar').addEventListener('click', carregarLancamentos);

// Editar
document.querySelector('#tabela-lancamentos tbody').addEventListener('click', function (e) {
  if (!e.target.classList.contains('btn-edit')) return;

  const id = e.target.dataset.id;
  fetch(API + '/lancamentos/' + id)
    .then(function (r) { return r.json(); })
    .then(function (l) {
      document.getElementById('edit-id').value = l.id;
      document.getElementById('edit-descricao').value = l.descricao;
      document.getElementById('edit-data').value = l.data_lancamento.substring(0, 10);
      document.getElementById('edit-valor').value = l.valor;
      document.getElementById('edit-tipo').value = l.tipo_lancamento;
      document.getElementById('edit-situacao').value = l.situacao;
      document.getElementById('modal-editar').classList.remove('hidden');
    });
});

document.getElementById('btn-cancelar-edicao').addEventListener('click', function () {
  document.getElementById('modal-editar').classList.add('hidden');
});

document.getElementById('form-editar').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const dados = {
    descricao: document.getElementById('edit-descricao').value,
    data_lancamento: document.getElementById('edit-data').value,
    valor: Number(document.getElementById('edit-valor').value),
    tipo_lancamento: document.getElementById('edit-tipo').value,
    situacao: document.getElementById('edit-situacao').value
  };

  fetch(API + '/lancamentos/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
    .then(function (r) { return r.json(); })
    .then(function () {
      document.getElementById('modal-editar').classList.add('hidden');
      carregarLancamentos();
    });
});

// Exportar PDF
document.getElementById('btn-exportar-pdf').addEventListener('click', function () {
  const tipo = document.getElementById('filtro-tipo').value;
  const situacao = document.getElementById('filtro-situacao').value;

  const params = new URLSearchParams();
  if (tipo) params.append('tipo_lancamento', tipo);
  if (situacao) params.append('situacao', situacao);

  let url = API + '/lancamentos/export/pdf';
  if (params.toString()) url += '?' + params.toString();

  window.open(url, '_blank');
});

// === USUÁRIOS ===

document.getElementById('form-usuario').addEventListener('submit', function (e) {
  e.preventDefault();

  const dados = {
    nome: document.getElementById('user-nome').value,
    login: document.getElementById('user-login').value,
    senha: document.getElementById('user-senha').value,
    situacao: document.getElementById('user-situacao').value
  };

  const msgEl = document.getElementById('msg-usuario');

  fetch(API + '/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
    .then(function (r) {
      if (!r.ok) throw new Error('Erro ao cadastrar');
      return r.json();
    })
    .then(function (usuario) {
      msgEl.textContent = 'Usuário "' + usuario.nome + '" cadastrado com sucesso!';
      msgEl.className = 'msg success';
      document.getElementById('form-usuario').reset();
    })
    .catch(function (err) {
      msgEl.textContent = err.message;
      msgEl.className = 'msg error';
    });
});

// Carregar ao iniciar
carregarLancamentos();
