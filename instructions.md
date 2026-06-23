# Instructions

## 0 - Verificar se o servidor está limpo

```bash
docker ps -a
docker images
docker volume ls
```

Os três comandos não devem retornar nada. Se retornarem, limpe tudo antes de prosseguir:

```bash
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -q) --force
sudo rm -rf /opt/finance-api /opt/jenkins_home
```

## 1 - Instalar tudo no servidor (máquina vazia)

O Ansible instala Docker, Jenkins, clona o repositório e sobe todos os ambientes.

```bash
ansible-playbook -i ansible/inventory.ini ansible/install.yml --ask-pass --ask-become-pass
```

Quando pedir senha, informe a senha do usuário `matheus`.

## 2 - URL de cada ambiente

- Local: http://177.44.248.114:3000
- HML: http://177.44.248.114:3001
- Prod: http://177.44.248.114:3002
- Jenkins: http://177.44.248.114:8080

## 3 - Rodar pipeline no Jenkins

1. Acessar http://177.44.248.114:8080
2. Abrir o job `finance-api-pipeline`
3. Clicar em `Build with Parameters`
4. Escolher o ambiente (local, hml ou prod)
5. Clicar em `Build`

A pipeline executa: Lint → Tests → Deploy → Seed Database → Health Check

## 4 - Rodar migration

```bash
# Local
docker compose -p finance-api-local -f docker-compose.yml -f docker-compose.local.yml exec -T app npm run migrate

# HML
docker compose -p finance-api-hml -f docker-compose.yml -f docker-compose.hml.yml exec -T app npm run migrate

# Prod
docker compose -p finance-api-prod -f docker-compose.yml -f docker-compose.prod.yml exec -T app npm run migrate
```

## 5 - Subir ou parar um ambiente (manual)

```bash
cd /opt/finance-api

# Subir Local
docker compose -p finance-api-local -f docker-compose.yml -f docker-compose.local.yml up -d --build

# Subir HML
docker compose -p finance-api-hml -f docker-compose.yml -f docker-compose.hml.yml up -d --build

# Subir Prod
docker compose -p finance-api-prod -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Parar Local
docker compose -p finance-api-local -f docker-compose.yml -f docker-compose.local.yml down

# Parar HML
docker compose -p finance-api-hml -f docker-compose.yml -f docker-compose.hml.yml down

# Parar Prod
docker compose -p finance-api-prod -f docker-compose.yml -f docker-compose.prod.yml down
```

## 6 - Depois de reiniciar o servidor

Os containers voltam automaticamente. Para confirmar:

```bash
docker ps
```

Se algum não subiu:

```bash
cd /opt/finance-api
docker start finance-api-jenkins
docker compose -p finance-api-local -f docker-compose.yml -f docker-compose.local.yml up -d
docker compose -p finance-api-hml -f docker-compose.yml -f docker-compose.hml.yml up -d
docker compose -p finance-api-prod -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 7 - Acessar o PostgreSQL

Para listar todas as tabelas:

```bash
# Local
docker compose -p finance-api-local -f docker-compose.yml -f docker-compose.local.yml exec db psql -U postgres -d finance_api_local -c '\dt'

# HML
docker compose -p finance-api-hml -f docker-compose.yml -f docker-compose.hml.yml exec db psql -U postgres -d finance_api_hml -c '\dt'

# Prod
docker compose -p finance-api-prod -f docker-compose.yml -f docker-compose.prod.yml exec db psql -U postgres -d finance_api_prod -c '\dt'
```

Comandos úteis dentro do psql:

- `\dt` — listar tabelas
- `\d nome_tabela` — ver estrutura de uma tabela
- `SELECT * FROM nome_tabela;` — ver dados
- `\q` — sair
