/* -*- mode: groovy -*- */
// dontKillMe
// jenkins will kill any process spawned during the job
// https://wiki.jenkins.io/display/JENKINS/ProcessTreeKiller
pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '50', daysToKeepStr: '60', numToKeepStr: '50')
    disableConcurrentBuilds()
    disableResume()
    durabilityHint 'PERFORMANCE_OPTIMIZED'
    timestamps()
  }

  agent none

  stages {
    stage('test') {
      agent {label 'bounty-frontend-test-machine'}
      steps {
        script {
          sh (label: 'pre-build', script: "yarn")
        }
        script {
          sh (label: 'lint', script: "yarn lint")
        }
      }
    }

    stage('multiple env') {
      parallel {
        stage('ci env') {
          when {
            anyOf {
              branch 'dev'
              branch 'jenkins-pipeline'
            }
          }
          agent {label 'bounty-frontend-test-machine'}
          steps {
            script {
              sh (label: 'pre-build', script: "yarn")
            }
            script {
              sh (label: 'build', script: "yarn build")
            }
            script {
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/bounty/web
sudo mkdir -p /www/bounty/web
sudo cp -r dist /www/bounty/web/
""")
            }
          }
        }

        stage('staging env') {
          when {
            allOf {
              environment name: 'CHANGE_TARGET', value: 'master'
            }
          }
          agent {label 'bounty-backend-staging-machine'}
          steps {
            script {
              sh (label: 'pre-build', script: "yarn")
            }
            withCredentials([string(credentialsId: 'ali-oss-key-prod', variable: 'ALI_OSS_KEYS')]) {
              sh (label: 'build', script: "ALI_OSS_KEYS='$ALI_OSS_KEYS' yarn build")
            }
            script {
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/bounty/web/staging
sudo mkdir -p /www/bounty/web/staging
sudo cp -r dist /www/bounty/web/staging/
""")
            }
          }
        }

        stage('prod env') {
          when {
            allOf {
              branch 'master'
            }
          }
          agent {label 'bounty-frontend-production-machine'}
          steps {
            script {
              sh (label: 'pre-build', script: "yarn")
            }
            withCredentials([string(credentialsId: 'ali-oss-key-prod', variable: 'ALI_OSS_KEYS')]) {
              sh (label: 'build', script: "ALI_OSS_KEYS='$ALI_OSS_KEYS' yarn build")
            }
            script {
              sh (label: 'move to nginx www', script: """
sudo mkdir -p /www/bounty/web
sudo rm -rf /www/bounty/web/dist
sudo cp -r dist /www/bounty/web/
""")
            }
          }
        }
      }
    }
  }
}