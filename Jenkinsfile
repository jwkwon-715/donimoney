def app
pipeline {
    agent any

    environment {
        PROJECT_ID    = 'resonant-sunset-466808-s8'
        CLUSTER_NAME  = 'kube-b'
        LOCATION      = 'asia-northeast3-b'
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

        stage('Lint') {
            steps {
                script {
                    app.inside {
                        sh '''
                            export NODE_ENV=development
                            npm ci
                            npm run lint || echo "[WARN] ESLint issues detected (not failing build for now)"
                        '''
                    }
                }
            }
        }

        stage('Push image') {
            when{
                branch 'main'
            }
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
