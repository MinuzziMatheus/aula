# Ansible

Arquivos simples para preparar o servidor Ubuntu `177.44.248.114` com Docker, Jenkins e os ambientes da API.

Repositorio usado:

```txt
https://github.com/MinuzziMatheus/aula.git
```

Servidor usado:

```bash
ssh univates@177.44.248.114
```

## 1. Testar SSH

Antes de rodar o Ansible, confirme que o SSH funciona:

```bash
ssh univates@177.44.248.114
```

Se o servidor pedir senha, informe a senha do usuario `univates`.

## 2. Instalar Ansible na maquina de controle

Rode estes comandos na maquina onde voce vai executar o Ansible. Se estiver no Windows, use WSL Ubuntu ou uma maquina Linux:

```bash
sudo apt update
sudo apt install -y ansible
```

## 3. Conferir inventory

O arquivo `ansible/inventory.ini` deve ficar assim:

```txt
[finance]
177.44.248.114 ansible_user=univates
```

Se voce usa chave SSH especifica:

```txt
[finance]
177.44.248.114 ansible_user=univates ansible_ssh_private_key_file=~/.ssh/sua-chave.pem
```

## 4. Testar conexao do Ansible

Na raiz do projeto, rode:

```bash
ansible -i ansible/inventory.ini finance -m ping --ask-pass
```

Quando pedir `SSH password`, informe a senha do usuario `univates`.

## 5. Instalar tudo no servidor

Na raiz do projeto, rode:

```bash
ansible-playbook -i ansible/inventory.ini ansible/install.yml --ask-pass --ask-become-pass
```

Quando pedir:

```txt
SSH password:
BECOME password:
```

informe a senha do usuario `univates`.

O playbook vai instalar dependencias, Docker, Docker Compose, Jenkins, clonar o repositorio e subir os ambientes.
O Docker e o Docker Compose plugin sao instalados pelo repositorio oficial da Docker, nao pelo pacote padrao do Ubuntu.

Nao coloque a senha no `inventory.ini`, porque esse arquivo vai para o Git.

## Arquivo .env no servidor

O `.env` nao vai para o Git. O Ansible cria o arquivo automaticamente em:

```txt
/opt/finance-api/.env
```

Quando a pipeline roda no Jenkins, o repositorio e clonado em `/var/jenkins_home/workspace/...`.
Por isso o `Jenkinsfile` cria um `.env` temporario a partir do `.env.example` se o arquivo nao existir no workspace.

Os valores ficam em `app_env`, dentro do `ansible/install.yml`.

Para usar e-mail de verdade, troque estes campos antes de rodar:

```yaml
app_env:
  MAIL_ENABLED: true
  MAIL_HOST: smtp.gmail.com
  MAIL_PORT: 587
  MAIL_USER: seu-email@gmail.com
  MAIL_PASSWORD: sua-senha-de-app
  MAIL_FROM: seu-email@gmail.com
  MAIL_TO: destino@exemplo.com
  MAIL_SECURE: false
```

Nao commite senhas reais no Git. Para senha real, prefira `ansible-vault` ou passe a variavel no momento da execucao.

## Variaveis principais

- `install_jenkins`: sobe Jenkins em container.
- `subir_ambientes`: sobe `local`, `hml` e `prod`.
- `configure_firewall`: libera as portas necessarias com UFW.
- `app_dir`: pasta onde o repositorio sera clonado no servidor.
- `repo_url`: URL do repositorio Git.
- `jenkins_job_name`: nome do job pipeline criado automaticamente no Jenkins.

O Jenkins e criado com Docker CLI, Docker Compose e plugins basicos de pipeline/Git.
Ele tambem recebe acesso ao `/var/run/docker.sock`, entao consegue executar a pipeline do projeto.

## URLs esperadas

```txt
Jenkins: http://177.44.248.114:8080
Local:   http://177.44.248.114:3000/health
HML:     http://177.44.248.114:3001/health
Prod:    http://177.44.248.114:3002/health
```

Exemplo de rota base:

```txt
http://177.44.248.114
```

## Usar pipeline com parametro

Depois da instalacao:

1. Acesse `http://177.44.248.114:8080`.
2. Abra o job `finance-api-pipeline`.
3. Clique em `Build with Parameters`.
4. Escolha `AMBIENTE`: `local`, `hml` ou `prod`.
5. Clique em `Build`.

Cada ambiente atualiza somente seus proprios containers:

```txt
local -> finance-api-local
hml   -> finance-api-hml
prod  -> finance-api-prod
```
