/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const { NodeSSH } = require('node-ssh')

const ssh = new NodeSSH()

async function run() {
  await ssh.connect({
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWD,
  })

  await ssh.putDirectory(__dirname + '/uggsm-server/dist', `${process.env.DEPLOY_SERVER_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  await ssh.putDirectory(__dirname + '/uggsm-client/dist', `${process.env.DEPLOY_CLIENT_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  process.exit()
}

run()
