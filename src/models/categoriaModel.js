const db = require('../config/database');

async function listarTodas() {
  const result = await db.query(
    'SELECT id, nome, descricao, situacao, criado_em FROM categoria ORDER BY nome ASC'
  );
  return result.rows;
}

async function criar({ nome, descricao, situacao }) {
  const result = await db.query(
    `INSERT INTO categoria (nome, descricao, situacao)
     VALUES ($1, $2, $3)
     RETURNING id, nome, descricao, situacao, criado_em`,
    [nome, descricao || null, situacao || 'ATIVO']
  );
  return result.rows[0];
}

module.exports = { listarTodas, criar };
