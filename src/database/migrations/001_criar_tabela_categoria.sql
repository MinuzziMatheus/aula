CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    situacao VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    criado_em TIMESTAMP DEFAULT NOW()
);

INSERT INTO categoria (nome, descricao)
VALUES
  ('Alimentação', 'Gastos com supermercado e restaurantes'),
  ('Moradia', 'Aluguel, condomínio e contas da casa'),
  ('Transporte', 'Combustível, estacionamento e transporte público'),
  ('Saúde', 'Consultas, exames e medicamentos'),
  ('Lazer', 'Entretenimento e viagens'),
  ('Salário', 'Receita mensal fixa')
ON CONFLICT (nome) DO NOTHING;
