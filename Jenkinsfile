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
            docker compose exec -T app node -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))" && exit 0
            sleep 3
          done

          echo "API nao respondeu"
          docker compose ps
          docker compose logs app
          exit 1
        '''
      }
    }
  }
}
