pipeline {
    agent any

    environment {
        SCANNER_HOME = tool sonar-scanner
    }

    stages {
        stage(SonarQube Analysis) {
            steps {
                withSonarQubeEnv(sonarqube) {
                    sh ${SCANNER_HOME}/bin/sonar-scanner
                }
            }
        }

        stage(Build & Deploy) {
            steps {
                sh docker compose up -d --build
            }
        }
    }
}
