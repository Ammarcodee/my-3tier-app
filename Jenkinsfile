pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=my-3tier-app -Dsonar.sources=backend,frontend/src -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**"
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                sh 'docker compose up -d --build'
            }
        }
    }
}

