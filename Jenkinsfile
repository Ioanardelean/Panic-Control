pipeline {
  agent any


  stages {

    stage('Git') {
      steps {
        git 'https://github.com/Ioanardelean/Panic-Control.git'
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
      }
    }


    stage('Unit test for server and app') {
      steps {
        sh 'npm test'
      }
    }
  }
}
