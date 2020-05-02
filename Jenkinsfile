pipeline {
  agent any

  stages {

    stage('Clonig Git') {

      steps {
        deleteDir()
        git([url: 'https://github.com/Ioanardelean/Panic-Control.git', branch: 'develop'])

      }
    }

    stage('Install dependencies') {
      steps {
        bat ' npm run install'

      }
    }

       stage('Linter') {

      steps {
        bat 'npm run lint'

      }
    }
     stage('Build') {
      steps {
        bat ' npm run build '
      }
    }

    stage('Tests') {

      steps {
        bat 'npm run test:server'
      }
    }
  }
}
