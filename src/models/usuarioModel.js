const db = require('../config/database');

async function listarTodos() {
  const result = await db.query(
    'SELECT id, nome, login, situacao FROM usuario ORDER BY id ASC'
  );

  return result.rows;
}

async function buscarPorId(id) {
  const result = await db.query(
    'SELECT id, nome, login, situacao FROM usuario WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

async function criar({ nome, login, senha, situacao }) {
  const result = await db.query(
    `
      INSERT INTO usuario (nome, login, senha, situacao)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, login, situacao
    `,
    [nome, login, senha, situacao]
  );

  return result.rows[0];
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar
};
