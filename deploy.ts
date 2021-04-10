/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv'
import { NodeSSH } from 'node-ssh'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import { exec } from 'promisify-child-process'
import ora from 'ora'
import chalk from 'chalk'
import path from 'path'

dotenv.config()

export type Config = {
  b: {
    app: string
    appPckg: string
    srv: string
    srvPckg: string
    bckp: string
    bckpPckg: string
    cli: string
    cliPckg: string
  }
  d: {
    srv: string
    srvPckg: string
    app: string
    bckp: string
    bckpPckg: string
  }
}

const config: Config = {
  b: {
    app: path.resolve(`${__dirname}/../packages/uggsm-client/dist`),
    appPckg: path.resolve(`${__dirname}/../packages/uggsm-client/package.json`),
    srv: path.resolve(`${__dirname}/../packages/uggsm-server/dist`),
    srvPckg: path.resolve(`${__dirname}/../packages/uggsm-server/package.json`),
    bckp: path.resolve(`${__dirname}/../packages/uggsm-backup-system/dist`),
    bckpPckg: path.resolve(`${__dirname}/../packages/uggsm-backup-system/package.json`),
    cli: path.resolve(`${__dirname}/../packages/uggsm-cli/dist`),
    cliPckg: path.resolve(`${__dirname}/../packages/uggsm-cli/package.json`),
  },
  d: {
    srv: '/var/www/api',
    srvPckg: '/var/www/api/package.json',
    app: '/var/www/app',
    bckp: '/var/uggsm-backup',
    bckpPckg: '/var/uggsm-backup/package.json',
  },
}

class Deploy {
  private spinner = null

  public scope = ''

  public sshConnection: NodeSSH

  public queue: Promise<any>

  public commentsShortcuts: Record<string, string> = {
    buildStart: 'Собираем проект...',
    buildEnd: 'Проект успешно собран!',
    putBuildFolderStart: 'Размещаем проект на сервере...',
    putBuildFolderEnd: 'Проект успешно размещён!',
    putDependenciesFileStart: 'Размещаем файл зависимостей на сервере...',
    putDependenciesFileEnd: 'Файл успешно размещён!',
    setupDependenciesStart: 'Устанавливаем зависимости...',
    setupDependenciesEnd: 'Зависимости установлены!',
    deleteLocalStart: 'Удаляем локальную копию сборки...',
    deleteLocalEnd: 'Локальная копия успешно удалена!',
  }

  constructor(ssh: NodeSSH) {
    this.sshConnection = ssh

    this.queue = Promise.resolve()
  }

  then(callback: (queue: any) => any) {
    callback(this.queue)
  }

  chain(callback: (queue: any) => any) {
    return (this.queue = this.queue.then(callback))
  }

  public setScope(scope: string) {
    this.scope = scope.toUpperCase()

    return this
  }

  public log(message: string) {
    this.chain(async () => {
      return new Promise((resolve) => {
        if (this.commentsShortcuts[message]) {
          message = this.commentsShortcuts[message]
        }

        message = `${chalk.white.bold.bgBlackBright(`${this.scope}`)} ${chalk.white(message)}`

        if (!this.spinner) {
          console.log(message)
          this.spinner = ora().start(message)
        } else {
          this.spinner.stop()
          console.log(message)
          this.spinner = ora().start(message)
        }

        resolve(message)
      })
    })

    return this
  }

  public exec(command: string, logBefore?: string, logAfter?: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      await exec(command)
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }

  public sshExec(command: string, cwd: string, logBefore?: string, logAfter?: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      try {
        const response = await this.sshConnection.execCommand(command, { cwd })

        console.log(response)
      } catch (error) {
        console.log(error)
      }
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }

  public sshPutDir(origin: string, destination: string, logBefore?: string, logAfter?: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      try {
        const response = await this.sshConnection.putDirectory(origin, destination, {
          recursive: true,
          concurrency: 10,
        })

        console.log(response)
      } catch (error) {
        console.log(error)
      }
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }

  public sshPutFile(origin: string, destination: string, logBefore?: string, logAfter?: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      await this.sshConnection.putFile(origin, destination)
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }

  public rmDir(path: string, logBefore?: string, logAfter?: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(() => {
      return new Promise((resolve) => {
        fs.rmdirSync(path, { recursive: true })
        resolve(path)
      })
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }
}

async function deployment(deploy: Deploy, config: Config) {
  return {
    async server() {
      await deploy
        .setScope('server')
        .exec('yarn build:server', 'buildStart', 'buildEnd')
        .sshPutDir(config.b.srv, config.d.srv, 'putBuildFolderStart', 'putBuildFolderEnd')
        .sshPutFile(config.b.srvPckg, config.d.srvPckg, 'putDependenciesFileStart', 'putDependenciesFileEnd')
        .sshExec('npm i', config.d.srv, 'setupDependenciesStart', 'setupDependenciesEnd')
        .rmDir(config.b.srv, 'deleteLocalStart', 'deleteLocalEnd')
    },
    async client() {
      await deploy
        .setScope('application')
        .exec('yarn build:app', 'buildStart', 'buildEnd')
        .sshPutDir(config.b.app, config.d.app, 'putBuildFolderStart', 'putBuildFolderEnd')
        .rmDir(config.b.app, 'deleteLocalStart', 'deleteLocalEnd')
    },
    async bckpSystem() {
      await deploy
        .setScope('backup system')
        .exec('yarn build:backup-system', 'buildStart', 'buildEnd')
        .sshPutDir(config.b.bckp, config.d.bckp, 'putBuildFolderStart', 'putBuildFolderEnd')
        .sshPutFile(config.b.bckpPckg, config.d.bckpPckg, 'putDependenciesFileStart', 'putDependenciesFileEnd')
        .sshExec('npm i', config.d.bckp, 'setupDependenciesStart', 'setupDependenciesEnd')
        .rmDir(config.b.bckp, 'deleteLocalStart', 'deleteLocalEnd')
    },
  }
}

async function run(
  scope: 'deploy-only-server' | 'deploy-only-client' | 'deploy-client-and-server' | 'deploy-backup-system'
) {
  const ssh = await new NodeSSH().connect({
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWD,
  })

  const deploy = new Deploy(ssh)

  const d = await deployment(deploy, config)

  switch (scope) {
    case 'deploy-only-server':
      await d.server()
      break
    case 'deploy-only-client':
      await d.client()
      break
    case 'deploy-backup-system':
      await d.bckpSystem()
      break
    case 'deploy-client-and-server':
      await d.client()
      await d.server()
      break
  }

  process.exit()
}

async function cli() {
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
}

cli()
