CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    login VARCHAR(80) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    situacao VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS lancamento (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_lancamento DATE NOT NULL,
    valor NUMERIC(12, 2) NOT NULL,
    tipo_lancamento VARCHAR(20) NOT NULL,
    situacao VARCHAR(20) NOT NULL
);

INSERT INTO usuario (nome, login, senha, situacao)
VALUES ('Administrador', 'admin', '123456', 'ATIVO')
ON CONFLICT (login) DO NOTHING;

INSERT INTO lancamento (descricao, data_lancamento, valor, tipo_lancamento, situacao)
SELECT
  seed.descricao,
  seed.data_lancamento,
  seed.valor,
  seed.tipo_lancamento,
  seed.situacao
FROM (
  VALUES
    ('Salario mensal', DATE '2026-04-01', 5500.00::NUMERIC(12, 2), 'RECEITA', 'PAGO'),
    ('Freelance website', DATE '2026-04-03', 1800.00::NUMERIC(12, 2), 'RECEITA', 'PAGO'),
    ('Aluguel apartamento', DATE '2026-04-05', 1500.00::NUMERIC(12, 2), 'DESPESA', 'PAGO'),
    ('Conta de energia', DATE '2026-04-06', 220.45::NUMERIC(12, 2), 'DESPESA', 'PENDENTE'),
    ('Supermercado', DATE '2026-04-07', 489.90::NUMERIC(12, 2), 'DESPESA', 'PAGO'),
    ('Internet residencial', DATE '2026-04-08', 129.90::NUMERIC(12, 2), 'DESPESA', 'PAGO'),
    ('Academia', DATE '2026-04-09', 99.90::NUMERIC(12, 2), 'DESPESA', 'PAGO'),
    ('Venda notebook usado', DATE '2026-04-10', 2100.00::NUMERIC(12, 2), 'RECEITA', 'PENDENTE'),
    ('Consulta medica', DATE '2026-04-11', 350.00::NUMERIC(12, 2), 'DESPESA', 'PENDENTE'),
    ('Restaurante', DATE '2026-04-12', 142.70::NUMERIC(12, 2), 'DESPESA', 'PAGO')
) AS seed(descricao, data_lancamento, valor, tipo_lancamento, situacao)
WHERE NOT EXISTS (SELECT 1 FROM lancamento);
