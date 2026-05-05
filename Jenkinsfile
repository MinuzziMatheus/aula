pipeline {
  agent any

  parameters {
    choice(name: 'ENV', choices: ['local', 'hml', 'prod'], description: 'Ambiente')
  }

  stages {
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