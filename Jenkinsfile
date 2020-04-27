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

     stage('Build dist') {
      steps {
        bat ' npm run server:build:dev '
        bat ' npm run app:build:prod'
      }
    }



    stage('Unit test') {

      steps {
        bat 'npm run test:server'
        bat 'npm run test:app'
      }
    }
  }
}
