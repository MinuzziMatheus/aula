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
          echo "Aguardando SonarQube ficar pronto..."
          COMPOSE_CMD="docker compose -p finance-api-${AMBIENTE} -f docker-compose.yml -f docker-compose.${AMBIENTE}.yml"

          $COMPOSE_CMD up -d sonarqube

          for i in $(seq 1 30); do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9000/api/system/status || true)
            if [ "$STATUS" = "200" ]; then
              echo "SonarQube pronto!"
              break
            fi
            echo "Tentativa $i - aguardando SonarQube..."
            sleep 10
          done

          docker run --rm \
            --network="host" \
            -v "$(pwd):/usr/src" \
            -w /usr/src \
            sonarsource/sonar-scanner-cli \
              -Dsonar.host.url=http://localhost:9000 \
              -Dsonar.token=${SONAR_TOKEN} \
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
