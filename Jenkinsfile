pipeline {
  agent any


  stages {

    stage('Clonig Git') {
      steps {
        git 'https://github.com/Ioanardelean/Panic-Control.git'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm run install'
      }
    }


    stage('Unit test for server') {
      steps {
        sh 'npm test'
      }
    }
  }
}
