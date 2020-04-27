pipeline {
  agent any

  stages {

    stage('Clonig Git') {

      steps {
        deleteDir()
        git 'https://github.com/Ioanardelean/Panic-Control.git'

      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
      }
    }


    stage('Unit test for server') {
      steps {
        sh 'npm test'
      }
    }
  }
}
