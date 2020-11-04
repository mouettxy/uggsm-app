import { each } from 'lodash'
/* eslint-disable @typescript-eslint/no-var-requires */
import { NodeSSH } from 'node-ssh'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import { exec } from 'promisify-child-process'
import { connectSSH } from './helpers'
import ora from 'ora'
import chalk from 'chalk'
import dotenv from 'dotenv'

dotenv.config()

class Commands {
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
    sysctlRestartStart: 'Начинаем рестарт демона...',
    sysctlRestartEnd: 'Демон успешно перезапущен!',
    sysctlStatusStart: 'Получаем статус демона...',
    sysctlStatusEnd: 'Статус успешно получен!',
    backupStart: 'Начинаем сборку бэкапа...',
    backupEnd: 'Бэкап успешно собран!',
    sleepStart: 'Ожидаем результатов...',
    sleepEnd: 'Результаты получены!',
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

  public sleep(time: number, logBefore: string, logAfter: string) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      return new Promise((resolve) => setTimeout(resolve, time))
    })

    if (logAfter) {
      this.log(logAfter)
    }

    return this
  }

  public setScope(scope: string) {
    this.scope = scope.toUpperCase()

    return this
  }

  public clear() {
    this.spinner.stop()
    this.scope = ''

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
          this.spinner = ora(message).start()
        } else {
          this.spinner.stop()
          console.log(message)
          this.spinner = ora(message).start()
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

  public sshExec(command: string, cwd: string, logBefore?: string, logAfter?: string, printStdOut?: boolean) {
    if (logBefore) {
      this.log(logBefore)
    }

    this.chain(async () => {
      const { stdout } = await this.sshConnection.execCommand(command, { cwd })
      this.log(stdout)
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
      await this.sshConnection.putDirectory(origin, destination, {
        recursive: true,
        concurrency: 10,
      })
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

async function commandPallet(commands: Commands) {
  const restartService = async (scope: string, daemon: string) => {
    await commands
      .setScope(scope)
      .sshExec(`systemctl restart ${daemon}`, '/', 'sysctlRestartStart', 'sysctlRestartEnd')
      .sleep(5000, 'sleepStart', 'sleepEnd')
      .sshExec(`systemctl restart ${daemon}`, '/', 'sysctlStatusStart', 'sysctlStatusEnd', true)
  }

  const restartServer = async () => {
    await restartService('server', 'uggsm-api')
  }

  const restartDatabase = async () => {
    await restartService('database', 'mongod')
  }

  const restartNginx = async () => {
    await restartService('nginx', 'nginx')
  }

  const restartBackup = async () => {
    await restartService('backup system', 'uggsm-backup')
  }

  const createBackup = async () => {
    await commands
      .setScope('create backup')
      .sshExec('/usr/bin/node index.js --dump', '/var/uggsm-backup', 'backupStart', 'backupEnd')
  }

  return {
    restartServer,
    restartDatabase,
    restartNginx,
    restartBackup,
    createBackup,
  }
}

async function runCommands(command: string) {
  const ssh = await connectSSH(new NodeSSH(), {
    host: process.env.DEPLOY_HOST,
    username: process.env.ROOT_USERNAME,
    password: process.env.ROOT_PASSWORD,
  })
  const commands = new Commands(ssh)
  const palett = await commandPallet(commands)

  switch (command) {
    case 'restart':
      await palett.restartServer()
      await palett.restartDatabase()
      await palett.restartNginx()
      break
    case 'restart-server':
      await palett.restartServer()
      break
    case 'restart-mongod':
      await palett.restartDatabase()
      break
    case 'restart-nginx':
      await palett.restartNginx()
      break
    case 'restart-backup':
      await palett.restartBackup()
      break
    case 'create-backup':
      await palett.createBackup()
      break
    case 'quit':
      process.exit()
  }

  await commands.clear()

  const question = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Что делаем',
      choices: [
        {
          name: 'Рестарт сервера, базы данных, сервера статики',
          value: 'restart',
        },
        {
          name: 'Создать внеплановую резервную копию базы данных',
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
          name: 'Рестарт сервера статики',
          value: 'restart-nginx',
        },
        {
          name: 'Рестарт бэкап системы',
          value: 'restart-backup',
        },
        {
          name: 'Выход',
          value: 'quit',
        },
      ],
    },
  ])

  if (question.command) {
    runCommands(question.command)
  }
}

async function cli() {
  const question = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Что делаем',
      choices: [
        {
          name: 'Рестарт сервера, базы данных, сервера статики',
          value: 'restart',
        },
        {
          name: 'Создать внеплановую резервную копию базы данных',
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
          name: 'Рестарт сервера статики',
          value: 'restart-nginx',
        },
        {
          name: 'Рестарт бэкап системы',
          value: 'restart-backup',
        },
        {
          name: 'Выход',
          value: 'quit',
        },
      ],
    },
  ])

  if (question.command) {
    runCommands(question.command)
  }
}

cli()
