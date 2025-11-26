def app
pipeline {
    agent any

    environment {
        PROJECT_ID    = 'resonant-sunset-466808-s8'
        CLUSTER_NAME  = 'kube'
        LOCATION      = 'asia-northeast3-a'
        CREDENTIALS_ID = 'gke'
        DOCKER_IMAGE  = 'jinseon901/test'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                script {
                    app = docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Test image') {
            steps {
                script {
                    app.inside {
                        sh 'npm ci'
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Push image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'jinseon901') {
                        app.push("${BUILD_NUMBER}")
                        app.push('latest')
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            //main 브랜치만 배포
            when {
                branch 'main'
            }
            steps {
                sh """
                    sed -i 's#${DOCKER_IMAGE}:[^[:space:]]*#${DOCKER_IMAGE}:${BUILD_NUMBER}#g' k8s/deployment.yaml
                """
                step([
                    $class: 'KubernetesEngineBuilder',
                    projectId:       env.PROJECT_ID,
                    clusterName:     env.CLUSTER_NAME,
                    location:        env.LOCATION,
                    credentialsId:   env.CREDENTIALS_ID,
                    manifestPattern: 'k8s/',
                    verifyDeployments: true
                ])
            }
        }
    }
}
