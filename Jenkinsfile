pipeline {
  agent any

  parameters {
    choice(name: 'ENV', choices: ['local', 'hml', 'prod'], description: 'Ambiente')
  }

  stages {

    stage('Deploy') {
      steps {
        script {
          def project = "finance-api-${params.ENV}"

          sh """
            docker-compose -p ${project} up -d --build app_${params.ENV}
          """
        }
      }
    }

    stage('Health Check') {
      steps {
        script {
          def port = params.ENV == 'local' ? '3000' : params.ENV == 'hml' ? '3001' : '3002'

          sh """
            for i in \$(seq 1 10)
            do
              echo "Tentativa \$i..."
              curl --fail http://localhost:${port} && exit 0
              sleep 3
            done

            echo "API falhou"
            exit 1
          """
        }
      }
    }

  }
}