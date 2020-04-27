pipeline {
  agent any

  stages {

    stage('Clonig Git') {

      steps {
        deleteDir()
        git([url: 'https://github.com/Ioanardelean/Panic-Control.git', branch: 'develop'])

      }
    }

    stage('Build') {
      steps {
        bat 'npm install'
      }
    }


    stage('Unit test for server') {
      steps {
        bat 'npm test'
      }
    }
  }
}
