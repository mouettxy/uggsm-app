/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
require('better-logging')(console)
const { NodeSSH } = require('node-ssh')

const fs = require('fs')
const ssh = new NodeSSH()

async function run() {
  await ssh.connect({
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWD,
  })

  await ssh.execCommand('rm -rf /var/www/api', { cwd: '/' })

  console.info('[SERVER] Folder removed')

  await ssh.putDirectory(__dirname + '/uggsm-server/dist', `${process.env.DEPLOY_SERVER_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.info('[SERVER] Folder putted in')

  await ssh.putFile(__dirname + '/uggsm-server/package.json', `${process.env.DEPLOY_SERVER_PATH}/package.json`)

  console.info('[SERVER] Package file putted in')

  await ssh.execCommand('npm i', { cwd: `${process.env.DEPLOY_SERVER_PATH}` })

  console.info('[SERVER] Packages installed')

  await ssh.execCommand('sudo systemctl stop uggsm-api', { cwd: '' })

  console.info('[SERVER] Server restarted')

  console.info('[SERVER] Deployed succesefully')

  console.info('[CLIENT] Folder removed')

  await ssh.putDirectory(__dirname + '/uggsm-client/dist', `${process.env.DEPLOY_CLIENT_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.info('[CLIENT] Deployed succesefully')

  process.exit()
}

run()

let serverDel = false
let clientDel = false
fs.rmdir(__dirname + '/uggsm-server/dist/', { recursive: true }, (err) => {
  if (err) {
    throw err
  }

  serverDel = true

  console.log(`'./uggsm-server/dist/' is deleted!`)
})

fs.rmdir(__dirname + '/uggsm-client/dist/', { recursive: true }, (err) => {
  if (err) {
    throw err
  }

  clientDel = true

  console.log(`'./uggsm-client/dist/' is deleted!`)
})

if (serverDel && clientDel) {
  process.exit()
} else {
  process.exit(1)
}
