pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Ammarcodee/my-3tier-app.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh " \/bin/sonar-scanner -Dsonar .projectKey=my-3tier-app -Dsonar .sources=.\
 }
 }
 }

 stage('Build & Deploy') {
 steps {
 sh 'sudo docker compose up -d --build'
 }
 }
 }
}
