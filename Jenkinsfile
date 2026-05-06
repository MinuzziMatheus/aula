pipeline {
  agent any

  stages {

    stage('Deploy') {
      steps {
        sh '''
          docker compose down -v || true
          docker compose up -d --build
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          for i in $(seq 1 10)
          do
            echo "Tentativa $i"
            curl -f http://localhost:3000 && exit 0
            sleep 3
          done

          echo "API não respondeu"
          exit 1
        '''
      }
    }
  }
}