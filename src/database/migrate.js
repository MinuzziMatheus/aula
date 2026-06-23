const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS migration_history (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('Nenhuma migration encontrada.');
    process.exit(0);
  }

  const { rows: executed } = await db.query('SELECT name FROM migration_history');
  const executedNames = executed.map(r => r.name);

  let count = 0;
  for (const file of files) {
    if (executedNames.includes(file)) {
      console.log(`[skip] ${file} (ja executada)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`[run]  ${file}`);
    await db.query(sql);
    await db.query('INSERT INTO migration_history (name) VALUES ($1)', [file]);
    count++;
  }

  console.log(count > 0 ? `${count} migration(s) executada(s).` : 'Nenhuma migration pendente.');
  process.exit(0);
}

migrate().catch(function (err) {
  console.error('Erro ao executar migrations:', err.message);
  process.exit(1);
});
