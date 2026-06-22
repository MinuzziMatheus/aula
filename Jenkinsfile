pipeline {
  agent any

  parameters {
    choice(
      name: 'AMBIENTE',
      choices: ['local', 'hml', 'prod'],
      description: 'Ambiente onde a API sera publicada'
    )
  }

  stages {

    stage('SonarQube Analysis') {
      steps {
        sh '''
          # Descobrir IP do host (Jenkins roda dentro de container)
          SONAR_URL="http://$(ip route | grep default | awk '{print $3}'):9000"
          echo "SonarQube URL: $SONAR_URL"

          # 1. Aguardar SonarQube ficar operacional
          echo "Aguardando SonarQube..."
          for i in 1 2 3; do
            RESP=$(curl -sf "$SONAR_URL/api/system/status" 2>&1 || true)
            echo "Tentativa $i - resposta: $RESP"
            if echo "$RESP" | grep -q '"status":"UP"'; then
              echo "SonarQube pronto!"
              break
            fi
            if [ "$i" = "3" ]; then
              echo "SonarQube nao respondeu em $SONAR_URL"
              echo "Verifique no servidor: docker ps | grep sonar"
              exit 1
            fi
            sleep 10
          done

          # 2. Trocar senha padrao no primeiro uso (ignora se ja foi trocada)
          curl -s -u admin:admin -X POST "$SONAR_URL/api/users/change_password" \
            -d "login=admin&previousPassword=admin&password=admin1234" 2>/dev/null || true

          SONAR_CREDS="admin:admin1234"

          # 3. Criar projeto (ignora se ja existe)
          curl -s -u $SONAR_CREDS -X POST "$SONAR_URL/api/projects/create" \
            -d "name=Finance+API&project=finance-api" || true

          # 4. Revogar token anterior e gerar novo
          curl -s -u $SONAR_CREDS -X POST "$SONAR_URL/api/user_tokens/revoke" \
            -d "name=jenkins-pipeline" || true

          SONAR_TOKEN=$(curl -s -u $SONAR_CREDS -X POST "$SONAR_URL/api/user_tokens/generate" \
            -d "name=jenkins-pipeline&type=PROJECT_ANALYSIS_TOKEN&projectKey=finance-api" \
            | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

          if [ -z "$SONAR_TOKEN" ]; then
            echo "Falha ao gerar token do SonarQube"
            exit 1
          fi

          echo "Token gerado com sucesso"

          # 5. Rodar scanner via Docker (--network=host acessa o SonarQube direto)
          docker run --rm \
            --network="host" \
            -v "$(pwd):/usr/src" \
            -w /usr/src \
            sonarsource/sonar-scanner-cli \
              -Dsonar.host.url=http://localhost:9000 \
              -Dsonar.token=$SONAR_TOKEN \
              -Dsonar.qualitygate.wait=true \
              -Dsonar.qualitygate.timeout=300
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          echo "Deploy no ambiente: ${AMBIENTE}"
          COMPOSE_CMD="docker compose -p finance-api-${AMBIENTE} -f docker-compose.yml -f docker-compose.${AMBIENTE}.yml"
          if [ ! -f .env ]; then
            cp .env.example .env
          fi
          docker compose -p finance-api-pipeline down || true
          $COMPOSE_CMD down || true
          set +e
          $COMPOSE_CMD up -d --build
          status=$?
          set -e
          if [ "$status" -ne 0 ]; then
            $COMPOSE_CMD ps
            $COMPOSE_CMD logs db
            exit "$status"
          fi
        '''
      }
    }

    stage('Seed Database') {
      steps {
        sh '''
          COMPOSE_CMD="docker compose -p finance-api-${AMBIENTE} -f docker-compose.yml -f docker-compose.${AMBIENTE}.yml"
          $COMPOSE_CMD exec -T db psql -U postgres -d finance_api_${AMBIENTE} -f /docker-entrypoint-initdb.d/init.sql
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          COMPOSE_CMD="docker compose -p finance-api-${AMBIENTE} -f docker-compose.yml -f docker-compose.${AMBIENTE}.yml"
          for i in $(seq 1 10)
          do
            echo "Tentativa $i"
            $COMPOSE_CMD exec -T app node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))" && exit 0
            sleep 3
          done

          echo "API nao respondeu"
          $COMPOSE_CMD ps
          $COMPOSE_CMD logs app
          exit 1
        '''
      }
    }
  }
}
