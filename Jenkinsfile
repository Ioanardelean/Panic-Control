pipeline {
  agent any

  stages {

    stage('Clonig Git') {
      deleteDir()
      steps {
        git 'https://github.com/Ioanardelean/Panic-Control.git'
        git branch: 'develop'
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
