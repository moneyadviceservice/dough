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
        stage('build') {
          when {branch 'master'}
            steps {
                sh('./script/build')
          }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
