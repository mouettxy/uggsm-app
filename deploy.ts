/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv'
import betterLogging from 'better-logging'
import { NodeSSH } from 'node-ssh'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import { exec } from 'promisify-child-process'
import ora from 'ora'

dotenv.config()

const config = {
  folders: {
    buildedServer: `${__dirname}/uggsm-server/dist`,
    buildedServerPackage: `${__dirname}/uggsm-server/package.json`,
    buildedClient: `${__dirname}/uggsm-client/dist`,
    buildedBackupSystem: `${__dirname}/uggsm-backup-system/dist`,
    buildedBackupSystemPackage: `${__dirname}/uggsm-backup-system/package.json`,
  },
  server: {
    serverFolder: '/var/www/api',
    serverFolderPackage: '/var/www/api/package.json',
    clientFolder: '/var/www/app',
    backupSystemFolder: '/var/uggsm-backup',
    backupSystemFolderPackage: '/var/uggsm-backup/package.json',
  },
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function connectSSH(instance: NodeSSH, credentials: { host: string; username: string; password: string }) {
  await instance.connect(credentials)

  return instance
}

let currentSpinnerInstance = null

function logScopeServer(message: string) {
  if (!currentSpinnerInstance) {
    currentSpinnerInstance = ora('[SERVER] ' + message).start()
  } else {
    currentSpinnerInstance.stop()
    currentSpinnerInstance = ora('[SERVER] ' + message).start()
  }
}

function logScopeClient(message: string) {
  if (!currentSpinnerInstance) {
    currentSpinnerInstance = ora('[CLIENT] ' + message).start()
  } else {
    currentSpinnerInstance.stop()
    currentSpinnerInstance = ora('[CLIENT] ' + message).start()
  }
}

function logScopeCommands(message: string) {
  if (!currentSpinnerInstance) {
    currentSpinnerInstance = ora('[COMMAND] ' + message).start()
  } else {
    currentSpinnerInstance.stop()
    currentSpinnerInstance = ora('[COMMAND] ' + message).start()
  }
}

function logScopeBackupSystem(message: string) {
  if (!currentSpinnerInstance) {
    currentSpinnerInstance = ora('[BACKUP SYSTEM] ' + message).start()
  } else {
    currentSpinnerInstance.stop()
    currentSpinnerInstance = ora('[BACKUP SYSTEM] ' + message).start()
  }
}

function logScopeGlobal(message: string) {
  if (!currentSpinnerInstance) {
    currentSpinnerInstance = ora('[GLOBAL] ' + message).start()
  } else {
    currentSpinnerInstance.stop()
    currentSpinnerInstance = ora('[GLOBAL] ' + message).start()
  }
}

async function deployServer(ssh: NodeSSH, config: any) {
  logScopeServer('Build started ...')
  await exec('npm run build-server')
  logScopeServer('Build completed')
  await ssh.execCommand(`rm -rf /var/www/api`, { cwd: '/' })
  logScopeServer('Folder removed')
  await ssh.putDirectory(config.folders.buildedServer, config.server.serverFolder, {
    recursive: true,
    concurrency: 10,
  })
  logScopeServer('Folder putted in')
  await ssh.putFile(config.folders.buildedServerPackage, config.server.serverFolderPackage)
  logScopeServer('Package file putted in')
  logScopeServer('Installing modules on server ...')
  await ssh.execCommand('npm i', { cwd: config.server.serverFolder })
  logScopeServer('Packages installed')
  logScopeServer('Deployed succesefully')
  logScopeClient('Removing local dist folder...')
  fs.rmdirSync(config.folders.buildedServer, { recursive: true })
  logScopeClient('Local dist folder succesefully removed')

  return Promise.resolve(true)
}

async function deployBackupSystem(ssh: NodeSSH, config: any) {
  logScopeBackupSystem('Build started ...')
  await exec('npm run build-backup-system')
  logScopeBackupSystem('Build completed')
  await ssh.execCommand(`rm -rf /var/uggsm-backup`, { cwd: '/' })
  logScopeBackupSystem('Folder removed')
  await ssh.putDirectory(config.folders.buildedBackupSystem, config.server.backupSystemFolder, {
    recursive: true,
    concurrency: 10,
  })
  logScopeBackupSystem('Folder putted in')
  await ssh.putFile(config.folders.buildedBackupSystemPackage, config.server.backupSystemFolderPackage)
  logScopeBackupSystem('Package file putted in')
  logScopeBackupSystem('Installing modules on server ...')
  await ssh.execCommand('npm i', { cwd: config.server.backupSystemFolder })
  logScopeBackupSystem('Packages installed')
  logScopeBackupSystem('Deployed succesefully')
  logScopeBackupSystem('Removing local dist folder...')
  fs.rmdirSync(config.folders.buildedBackupSystem, { recursive: true })
  logScopeBackupSystem('Local dist folder succesefully removed')

  return Promise.resolve(true)
}

async function deployClient(ssh: NodeSSH, config: any) {
  logScopeClient('Build started ...')
  await exec('npm run build-client')
  logScopeClient('Build completed')
  await ssh.putDirectory(config.folders.buildedClient, config.server.clientFolder, {
    recursive: true,
    concurrency: 10,
  })
  logScopeClient('Deployed succesefully')

  logScopeClient('Removing local dist folder...')
  fs.rmdirSync(config.folders.buildedClient, { recursive: true })
  logScopeClient('Local dist folder succesefully removed')

  return Promise.resolve(true)
}

async function run(scope: string) {
  const ssh = await connectSSH(new NodeSSH(), {
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWD,
  })

  if (scope === 'deploy-only-server') {
    await deployServer(ssh, config)

    logScopeGlobal('Server deployed succesefully')
  }

  if (scope === 'deploy-only-client') {
    await deployClient(ssh, config)

    logScopeGlobal('Client deployed succesefully')
  }

  if (scope === 'deploy-client-and-server') {
    await deployServer(ssh, config)
    await deployClient(ssh, config)

    logScopeGlobal('Client and server deployed succesefully')
  }

  if (scope === 'deploy-backup-system') {
    await deployBackupSystem(ssh, config)

    logScopeGlobal('Backup system deployed succesefully')
  }

  process.exit()
}

async function runCommands(command: string) {
  const ssh = await connectSSH(new NodeSSH(), {
    host: process.env.DEPLOY_HOST,
    username: process.env.ROOT_USERNAME,
    password: process.env.ROOT_PASSWORD,
  })

  let result

  if (command === 'restart') {
    logScopeCommands('Run global restart...')
    await ssh.execCommand('systemctl restart uggsm-api && systemctl restart mongod && systemctl restart nginx')
    logScopeCommands('Restarted succesefully')
    logScopeCommands('Waiting to startup...')
    await sleep(10000)
    logScopeCommands('Geting current status...')
    result = {
      api: (await ssh.execCommand('systemctl status uggsm-api')).stdout,
      mongod: (await ssh.execCommand('systemctl status mongod')).stdout,
      nginx: (await ssh.execCommand('systemctl status nginx')).stdout,
    }
    logScopeCommands('Current status got succesefully')
  } else if (command === 'restart-server') {
    logScopeCommands('Run server restart...')
    await ssh.execCommand('systemctl restart uggsm-api')
    logScopeCommands('Restarted succesefully')
    logScopeCommands('Waiting to startup...')
    await sleep(10000)
    logScopeCommands('Geting current status...')
    result = {
      api: (await ssh.execCommand('systemctl status uggsm-api')).stdout,
    }
    logScopeCommands('Current status got succesefully')
  } else if (command === 'restart-mongod') {
    logScopeCommands('Run mongod restart...')
    await ssh.execCommand('systemctl restart mongod')
    logScopeCommands('Restarted succesefully')
    logScopeCommands('Waiting to startup...')
    await sleep(10000)
    logScopeCommands('Geting current status...')
    result = {
      mongod: (await ssh.execCommand('systemctl status mongod')).stdout,
    }
    logScopeCommands('Current status got succesefully')
  } else if (command === 'restart-nginx') {
    logScopeCommands('Run nginx restart...')
    await ssh.execCommand('systemctl restart nginx')
    logScopeCommands('Restarted succesefully')
    logScopeCommands('Waiting to startup...')
    await sleep(10000)
    logScopeCommands('Geting current status...')
    result = {
      nginx: (await ssh.execCommand('systemctl status nginx')).stdout,
    }
    logScopeCommands('Current status got succesefully')
  } else if (command === 'restart-backup') {
    logScopeCommands('Run nginx restart...')
    await ssh.execCommand('systemctl restart uggsm-backup')
    logScopeCommands('Restarted succesefully')
    logScopeCommands('Waiting to startup...')
    await sleep(10000)
    logScopeCommands('Geting current status...')
    result = {
      uggsmBackup: (await ssh.execCommand('systemctl status uggsm-backup')).stdout,
    }
    logScopeCommands('Current status got succesefully')
  } else if (command === 'create-backup') {
    await ssh.execCommand('cd /var/uggsm-backup && /usr/bin/node index.js --dump')

    result = {
      backup: 'created succesefully',
    }
  }

  for (const key in result) {
    console.log(`[${key.toUpperCase()}]`)
    console.log(result[key])
  }

  process.exit()
}

async function cli() {
  const firstQuestion = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Режим работы',
      default: 'Деплой',
      choices: [
        {
          name: 'Деплой',
          value: 'deploy',
        },
        {
          name: 'Комманды серверу',
          value: 'commands',
        },
      ],
    },
  ])

  if (firstQuestion.mode === 'deploy') {
    const secondQuestion = await inquirer.prompt([
      {
        type: 'list',
        name: 'scope',
        message: 'Что деплоим?',
        default: 'Только клиент',
        choices: [
          {
            name: 'Клиент и Сервер',
            value: 'deploy-client-and-server',
          },
          {
            name: 'Только клиент',
            value: 'deploy-only-client',
          },
          {
            name: 'Только сервер',
            value: 'deploy-only-server',
          },
          {
            name: 'Только система бэкапов',
            value: 'deploy-backup-system',
          },
        ],
      },
    ])

    if (secondQuestion.scope) {
      run(secondQuestion.scope)
    }
  } else if (firstQuestion.mode === 'commands') {
    const secondQuestion = await inquirer.prompt([
      {
        type: 'list',
        name: 'command',
        message: 'Что делаем',
        choices: [
          {
            name: 'Рестарт сервера, базы, нгинкс',
            value: 'restart',
          },
          {
            name: 'Бэкап',
            value: 'create-backup',
          },
          {
            name: 'Рестарт сервера',
            value: 'restart-server',
          },
          {
            name: 'Рестарт базы',
            value: 'restart-mongod',
          },
          {
            name: 'Рестарт нгинкс',
            value: 'restart-nginx',
          },
          {
            name: 'Рестарт бэкап системы',
            value: 'restart-backup',
          },
        ],
      },
    ])

    if (secondQuestion.command) {
      runCommands(secondQuestion.command)
    }
  }
}

cli()
