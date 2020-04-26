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
