/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const { NodeSSH } = require('node-ssh')

const fs = require('fs')
const Path = require('path')

const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

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

  await ssh.putFile(__dirname + '/uggsm-server/package.json', `${process.env.DEPLOY_SERVER_PATH}/package.json`)

  await ssh.execCommand('npm i', { cwd: `${process.env.DEPLOY_SERVER_PATH}` })

  console.log('server deployed succesefuly')

  await ssh.putDirectory(__dirname + '/uggsm-client/dist', `${process.env.DEPLOY_CLIENT_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.log('client deployed succesefuly')

  fs.rmdir(__dirname + '/uggsm-server/dist/', { recursive: true }, (err) => {
    if (err) {
      throw err
    }

    console.log(`'./uggsm-server/dist/' is deleted!`)
  })

  fs.rmdir(__dirname + '/uggsm-client/dist/', { recursive: true }, (err) => {
    if (err) {
      throw err
    }

    console.log(`'./uggsm-client/dist/' is deleted!`)
  })

  process.exit()
}

run()
