import { each } from 'lodash'
/* eslint-disable @typescript-eslint/no-var-requires */
import { NodeSSH } from 'node-ssh'
import * as fs from 'fs'
import * as inquirer from 'inquirer'
import { exec } from 'promisify-child-process'
import config from './config'
import { connectSSH, sleep, downloadFile, getFolderFrom } from './helpers'
import { log } from './helpers/logging'
import * as temp from 'temp'
import decompress from 'decompress'
import decompressTargz from 'decompress-targz'
import * as path from 'path'

temp.track()
const currentSpinnerInstance = null

async function deployServer(ssh: NodeSSH, config: any) {
  log('server', 'Собираем проект ...', currentSpinnerInstance)
  try {
    const folder = await getFolderFrom('server', temp, config.githubToken)

    console.log(folder)
  } catch (error) {
    console.log(error)
  }
  log('server', 'Сборка завершена', currentSpinnerInstance)

  log('server', 'Удаляем файлы старой сборки ...', currentSpinnerInstance)
  //await ssh.execCommand(`rm -rf /var/www/api`, { cwd: '/' })
  log('server', 'Файлы старой сборки удалены успешно', currentSpinnerInstance)

  log('server', 'Размещаем файлы новой сборки ...', currentSpinnerInstance)
  /* await ssh.putDirectory(config.folders.buildedServer, config.server.serverFolder, {
    recursive: true,
    concurrency: 10,
  }) */
  log('server', 'Файлы новой сборки размещены успешно', currentSpinnerInstance)

  log('server', 'Устанавливаем зависимости на сервере ...', currentSpinnerInstance)
  /* await ssh.putFile(config.folders.buildedServerPackage, config.server.serverFolderPackage)
  await ssh.execCommand('npm i', { cwd: config.server.serverFolder }) */
  log('server', 'Зависимости установлены успешно', currentSpinnerInstance)

  log('server', 'Удаляем временные файлы проекта ...', currentSpinnerInstance)
  /* fs.rmdirSync(config.folders.buildedServer, { recursive: true }) */
  log('server', 'Временные файлы удалены успешно', currentSpinnerInstance)

  return Promise.resolve(true)
}

async function deployBackupSystem(ssh: NodeSSH, config: any) {
  log('backup system', 'Собираем проект ...', currentSpinnerInstance)
  await exec('npm run build-backup-system')
  log('backup system', 'Проект собран успешно', currentSpinnerInstance)

  log('backup system', 'Удаляем файлы старой сборки ...', currentSpinnerInstance)
  await ssh.execCommand(`rm -rf /var/uggsm-backup`, { cwd: '/' })
  log('backup system', 'Файлы старой сборки удалены успешно', currentSpinnerInstance)

  log('backup system', 'Размещаем файлы новой сборки ...', currentSpinnerInstance)
  await ssh.putDirectory(config.folders.buildedBackupSystem, config.server.backupSystemFolder, {
    recursive: true,
    concurrency: 10,
  })
  log('backup system', 'Файлы новой сборки размещены успешно', currentSpinnerInstance)

  log('backup system', 'Устанавливаем зависимости на сервере ...', currentSpinnerInstance)
  await ssh.putFile(config.folders.buildedBackupSystemPackage, config.server.backupSystemFolderPackage)
  await ssh.execCommand('npm i', { cwd: config.server.backupSystemFolder })
  log('backup system', 'Зависимости установлены успешно', currentSpinnerInstance)

  log('backup system', 'Удаляем временные файлы проекта ...', currentSpinnerInstance)
  fs.rmdirSync(config.folders.buildedBackupSystem, { recursive: true })
  log('backup system', 'Временные файлы удалены успешно', currentSpinnerInstance)

  return Promise.resolve(true)
}

async function deployClient(ssh: NodeSSH, config: any) {
  log('backup system', 'Собираем проект ...', currentSpinnerInstance)
  await exec('npm run build-client')
  log('backup system', 'Проект собран успешно', currentSpinnerInstance)

  log('backup system', 'Размещаем файлы новой сборки ...', currentSpinnerInstance)
  await ssh.putDirectory(config.folders.buildedClient, config.server.clientFolder, {
    recursive: true,
    concurrency: 10,
  })
  log('backup system', 'Файлы новой сборки размещены успешно', currentSpinnerInstance)

  log('backup system', 'Удаляем временные файлы проекта ...', currentSpinnerInstance)
  fs.rmdirSync(config.folders.buildedClient, { recursive: true })
  log('backup system', 'Временные файлы удалены успешно', currentSpinnerInstance)

  return Promise.resolve(true)
}

async function run(scope: string) {
  const ssh = await connectSSH(new NodeSSH(), {
    host: '194.58.120.238',
    username: 'default_user',
    password: 'xBfk55TUxqmBKMWC',
  })

  if (scope === 'deploy-only-server') {
    await deployServer(ssh, config)

    log('global', 'Сервер успешно собран и выгружен', currentSpinnerInstance)
  }

  if (scope === 'deploy-only-client') {
    await deployClient(ssh, config)

    log('global', 'Клиент успешно собран и выгружен', currentSpinnerInstance)
  }

  if (scope === 'deploy-client-and-server') {
    await deployServer(ssh, config)
    await deployClient(ssh, config)

    log('global', 'Клиент и Сервер успешно собраны и выгружены', currentSpinnerInstance)
  }

  if (scope === 'deploy-backup-system') {
    await deployBackupSystem(ssh, config)

    log('global', 'Система бэкапов успешно собрана и выгружена', currentSpinnerInstance)
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
    log('command', 'Запуск рестарта демонов ...', currentSpinnerInstance)
    await ssh.execCommand('systemctl restart uggsm-api && systemctl restart mongod && systemctl restart nginx')
    log('command', 'Успешный рестарт', currentSpinnerInstance)

    log('command', 'Ожидаем запуска ...', currentSpinnerInstance)

    await sleep(10000)

    log('command', 'Получаем текущий статус ...', currentSpinnerInstance)
    result = {
      api: (await ssh.execCommand('systemctl status uggsm-api')).stdout,
      mongod: (await ssh.execCommand('systemctl status mongod')).stdout,
      nginx: (await ssh.execCommand('systemctl status nginx')).stdout,
    }
    log('command', 'Текущий статус успешно получен', currentSpinnerInstance)
  } else if (command === 'restart-server') {
    log('command', 'Запуск рестарта сервера ...', currentSpinnerInstance)
    await ssh.execCommand('systemctl restart uggsm-api')
    log('command', 'Успешный рестарт', currentSpinnerInstance)

    log('command', 'Ожидаем запуска ...', currentSpinnerInstance)

    await sleep(10000)

    log('command', 'Получаем текущий статус ...', currentSpinnerInstance)
    result = {
      api: (await ssh.execCommand('systemctl status uggsm-api')).stdout,
    }
    log('command', 'Текущий статус успешно получен', currentSpinnerInstance)
  } else if (command === 'restart-mongod') {
    log('command', 'Запуск рестарта базы данных ...', currentSpinnerInstance)
    await ssh.execCommand('systemctl restart mongod')
    log('command', 'Успешный рестарт', currentSpinnerInstance)

    log('command', 'Ожидаем запуска ...', currentSpinnerInstance)

    await sleep(10000)

    log('command', 'Получаем текущий статус ...', currentSpinnerInstance)
    result = {
      mongod: (await ssh.execCommand('systemctl status mongod')).stdout,
    }
    log('command', 'Текущий статус успешно получен', currentSpinnerInstance)
  } else if (command === 'restart-nginx') {
    log('command', 'Запуск рестарта сервера статики ...', currentSpinnerInstance)
    await ssh.execCommand('systemctl restart nginx')
    log('command', 'Успешный рестарт', currentSpinnerInstance)

    log('command', 'Ожидаем запуска ...', currentSpinnerInstance)

    await sleep(10000)

    log('command', 'Получаем текущий статус ...', currentSpinnerInstance)
    result = {
      nginx: (await ssh.execCommand('systemctl status nginx')).stdout,
    }
    log('command', 'Текущий статус успешно получен', currentSpinnerInstance)
  } else if (command === 'restart-backup') {
    log('command', 'Запуск рестарта сервиса резервного копирования ...', currentSpinnerInstance)
    await ssh.execCommand('systemctl restart uggsm-backup')
    log('command', 'Успешный рестарт', currentSpinnerInstance)

    log('command', 'Ожидаем запуска ...', currentSpinnerInstance)

    await sleep(10000)

    log('command', 'Получаем текущий статус ...', currentSpinnerInstance)
    result = {
      uggsmBackup: (await ssh.execCommand('systemctl status uggsm-backup')).stdout,
    }
    log('command', 'Текущий статус успешно получен', currentSpinnerInstance)
  } else if (command === 'create-backup') {
    log('command', 'Запускаем внеплановую резервную копию базы данных ...', currentSpinnerInstance)
    await ssh.execCommand('cd /var/uggsm-backup && /usr/bin/node index.js --dump')
    log('command', 'Резервная копия успешно создана', currentSpinnerInstance)

    result = false
  }

  if (result) {
    for (const key in result) {
      console.log(`[${key.toUpperCase()}]`)
      console.log(result[key])
    }
  }

  process.exit()
}

async function cli() {
  const firstQuestion = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'Режим работы',
      default: 'Сборка и выгрузка',
      choices: [
        {
          name: 'Сборка и выгрузка',
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
        message: 'Что собрать и выгрузить',
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
        ],
      },
    ])

    if (secondQuestion.command) {
      runCommands(secondQuestion.command)
    }
  }
}

/* cli() */

run('deploy-only-server')
