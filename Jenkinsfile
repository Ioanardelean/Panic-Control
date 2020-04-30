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
        bat ' npm run install:server'
        bat ' npm run install:app'
      }
    }

       stage('Linter') {

      steps {
        bat 'npm run lint'

      }
    }

    stage('Tests') {

      steps {
        bat 'npm run test:server'
        bat 'npm run test:app'
      }
    }

     stage('Build') {
      steps {
        bat ' npm run server:build:dev '
        bat ' npm run app:build:dev'
      }
    }
  }
}
