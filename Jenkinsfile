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
      }
    }

     stage('Build dist') {
      steps {
        bat ' npm run server:build:dev '
      }
    }



    stage('Unit test for server') {

      steps {

        bat 'npm run test:server'
      }
    }
  }
}
