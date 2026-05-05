pipeline {
  agent any

  parameters {
    choice(name: 'ENV', choices: ['local', 'hml', 'prod'], description: 'Ambiente')
  }

  stages {

    stage('Setup Env') {
      steps {
        sh '''
          echo "NODE_ENV=development" > .env
          echo "PORT=3000" >> .env
          echo "DB_HOST=db" >> .env
          echo "DB_PORT=5432" >> .env
          echo "DB_NAME=finance_api" >> .env
          echo "DB_USER=postgres" >> .env
          echo "DB_PASSWORD=admin" >> .env
          echo "DB_SSL=false" >> .env
        '''
      }
    }

    stage('Deploy') {
      steps {
        script {
          if (params.ENV == 'prod') {
            input "Confirma deploy em produção?"
          }

          sh "docker-compose up -d --build app_${params.ENV}"
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          def port = params.ENV == 'local' ? '3000' : params.ENV == 'hml' ? '3001' : '3002'
          sh "curl http://host.docker.internal:${port}"
        }
      }
    }

  }
}