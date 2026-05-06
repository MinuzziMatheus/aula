pipeline {
  agent any

  parameters {
    choice(name: 'ENV', choices: ['local', 'hml', 'prod'], description: 'Ambiente')
  }

  stages {

    stage('Deploy') {
      steps {
        script {

          def port = params.ENV == 'local' ? '3000' :
                     params.ENV == 'hml' ? '3001' : '3002'

          sh """
            export ENV=${params.ENV}
            export PORT=${port}

            docker compose down || true
            docker compose up -d --build
          """
        }
      }
    }

    stage('Health Check') {
      steps {
        script {

          def port = params.ENV == 'local' ? '3000' :
                     params.ENV == 'hml' ? '3001' : '3002'

          sh """
            for i in \$(seq 1 10); do
              echo "Tentativa \$i"
              curl -f http://localhost:${port} && exit 0
              sleep 3
            done

            echo "API não respondeu"
            exit 1
          """
        }
      }
    }

  }
}