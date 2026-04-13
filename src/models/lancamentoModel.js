const db = require('../config/database');

async function listarTodos(filtros = {}) {
  const values = [];
  const conditions = [];

  if (filtros.data_inicial) {
    values.push(filtros.data_inicial);
    conditions.push(`data_lancamento >= $${values.length}`);
  }

  if (filtros.data_final) {
    values.push(filtros.data_final);
    conditions.push(`data_lancamento <= $${values.length}`);
  }

  if (filtros.tipo_lancamento) {
    values.push(filtros.tipo_lancamento);
    conditions.push(`tipo_lancamento = $${values.length}`);
  }

  if (filtros.situacao) {
    values.push(filtros.situacao);
    conditions.push(`situacao = $${values.length}`);
  }

  const whereClause = conditions.length > 0
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await db.query(
    `
      SELECT id, descricao, data_lancamento, valor, tipo_lancamento, situacao
      FROM lancamento
      ${whereClause}
      ORDER BY data_lancamento DESC, id DESC
    `,
    values
  );

  return result.rows;
}

async function buscarPorId(id) {
  const result = await db.query(
    `
      SELECT id, descricao, data_lancamento, valor, tipo_lancamento, situacao
      FROM lancamento
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function criar({ descricao, data_lancamento, valor, tipo_lancamento, situacao }) {
  const result = await db.query(
    `
      INSERT INTO lancamento (
        descricao,
        data_lancamento,
        valor,
        tipo_lancamento,
        situacao
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, descricao, data_lancamento, valor, tipo_lancamento, situacao
    `,
    [descricao, data_lancamento, valor, tipo_lancamento, situacao]
  );

  return result.rows[0];
}

async function atualizar(id, { descricao, data_lancamento, valor, tipo_lancamento, situacao }) {
  const result = await db.query(
    `
      UPDATE lancamento
      SET
        descricao = $2,
        data_lancamento = $3,
        valor = $4,
        tipo_lancamento = $5,
        situacao = $6
      WHERE id = $1
      RETURNING id, descricao, data_lancamento, valor, tipo_lancamento, situacao
    `,
    [id, descricao, data_lancamento, valor, tipo_lancamento, situacao]
  );

  return result.rows[0] || null;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar
};
