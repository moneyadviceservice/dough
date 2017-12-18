pipeline {
    agent {
        dockerfile {
            args '-u 0:0'
        }
    }

    stages {
        stage('Test') {
            steps {
                sh('./script/test')
            }
        }
    }
}
