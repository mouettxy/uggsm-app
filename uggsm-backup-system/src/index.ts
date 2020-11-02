import config from './config'
import { YandexDisk } from 'yandex-disk'
import { readdir, writeFile, remove, download } from './helpers'
import { exec } from 'promisify-child-process'
import moment from 'moment'
import * as fs from 'fs'
import * as path from 'path'
import { first } from 'lodash'
import logger from './helpers/logger'
import cron from 'node-cron'
import * as dotenv from 'dotenv'

import yargs from 'yargs'
// @ts-ignore
import { hideBin } from 'yargs/helpers'

yargs.help('h').alias('h', 'help').argv
const argv = yargs(hideBin(process.argv)).argv

dotenv.config()
moment.locale('ru')

const disk = new YandexDisk(config.token)

async function createDatabaseDump(credentials?: { username: string; password: string }) {
  try {
    const datetime = moment().format('DDMMYYYY_HHmmss')
    const archiveName = `${datetime}.gz`

    if (credentials) {
      await exec(
        `mongodump --authenticationDatabase admin --username ${credentials.username} --password ${credentials.password} -d uggsm -h localhost --gzip --archive=${archiveName}`,
        { cwd: __dirname }
      )
    } else {
      await exec(`mongodump -d uggsm -h localhost --gzip --archive=${archiveName}`, { cwd: __dirname })
    }

    return {
      name: archiveName,
      file: path.join(__dirname, archiveName),
    }
  } catch (error) {
    logger.error(`Error in "createDatabaseDump" creating backup`, {
      additional: error.message,
    })
    return {
      name: false,
      file: false,
    }
  }
}

async function downloadLastestDatabaseDump() {
  let backups
  try {
    const dailyBackups: any = await readdir(disk, config.paths.fullAutomaticDaily)
    const weeklyBackups: any = await readdir(disk, config.paths.fullAutomaticWeekly)
    const monthlyBackups: any = await readdir(disk, config.paths.fullAutomaticMonthly)

    backups = [...dailyBackups, ...weeklyBackups, ...monthlyBackups]
  } catch (error) {
    logger.error(`Error in "downloadLastestDatabaseDump" when reading backups list`, {
      additional: error.message,
    })
  }

  if (backups) {
    const lastest: any = first(
      backups.sort((a, b) => {
        const dateA = moment(a.displayName, 'DDMMYYYY_HHmmss')
        const dateB = moment(b.displayName, 'DDMMYYYY_HHmmss')

        return moment.utc(dateB).diff(moment.utc(dateA))
      })
    )

    try {
      await download(disk, lastest.href, path.join(__dirname, lastest.displayName))
    } catch (error) {
      logger.error(`Error in "downloadLastestDatabaseDump" when downloading backup`, {
        additional: error.message,
      })
      return false
    }

    return {
      name: lastest.displayName,
      path: path.join(__dirname, lastest.displayName),
    }
  }
}

async function restoreDatabaseFromDump(path: any, credentials?: { username: string; password: string }) {
  if (!path) {
    path = await downloadLastestDatabaseDump()
  }

  try {
    if (path) {
      if (credentials) {
        await exec(
          `mongorestore --authenticationDatabase admin --username ${credentials.username} --password ${credentials.password} ${path.path}`
        )
      } else {
        await exec(`mongorestore --drop --gzip --archive=${path.path}`)
      }

      logger.info(`Database restored from ${path}`)

      fs.unlinkSync(path.path)
    }
  } catch (error) {
    logger.error(`Error in "restoreDatabaseFromDump" when restoring database from path ${path}`, {
      additional: error.message,
    })
  }
}

async function uploadDatabaseDump(type: 'daily' | 'monthly' | 'weekly' | 'none', custom?: boolean) {
  const { name, file } = await createDatabaseDump({
    username: 'admin',
    password: 'qas87W5jfxD4GR6r',
  })

  if (custom) {
    try {
      if (name && file && typeof name !== 'boolean' && typeof file !== 'boolean') {
        await writeFile(disk, `${config.paths.fullCustom}/${name}`, file)

        logger.info(`Database custom dump created ${name}`)

        fs.unlinkSync(file)
      }
    } catch (error) {
      logger.error(`Error in "uploadDatabaseDump" when uploading custom backup`, {
        additional: error.message,
      })
    }
  } else {
    if (name && file && typeof name !== 'boolean' && typeof file !== 'boolean') {
      let diskPath = config.paths.fullAutomaticDaily
      if (type === 'daily') {
        diskPath = config.paths.fullAutomaticDaily
      } else if (type === 'weekly') {
        diskPath = config.paths.fullAutomaticWeekly

        try {
          const dailyBackups: any = await readdir(disk, config.paths.fullAutomaticDaily)
          for (const key in dailyBackups) {
            await remove(disk, dailyBackups[key].href)
          }
        } catch (error) {
          logger.error(`Error in "uploadDatabaseDump" when read & remove daily backups`, {
            additional: error.message,
          })
        }
      } else if (type === 'monthly') {
        diskPath = config.paths.fullAutomaticMonthly

        try {
          const weeklyBackups: any = await readdir(disk, config.paths.fullAutomaticWeekly)
          for (const key in weeklyBackups) {
            await remove(disk, weeklyBackups[key].href)
          }
        } catch (error) {
          logger.error(`Error in "uploadDatabaseDump" when read & remove weekly backups`, {
            additional: error.message,
          })
        }

        try {
          const monthlyBackups: any = await readdir(disk, config.paths.fullAutomaticMonthly)

          if (monthlyBackups.length + 1 > 2) {
            const sliced = monthlyBackups.slice(1)

            for (const key in sliced) {
              await remove(disk, sliced[key].href)
            }
          }
        } catch (error) {
          logger.error(`Error in "uploadDatabaseDump" when read & remove monthly backups`, {
            additional: error.message,
          })
        }
      }

      try {
        await writeFile(disk, `${diskPath}/${name}`, file)

        logger.info(`Database ${type} dump created ${name}`)

        fs.unlinkSync(file)
      } catch (error) {
        logger.error(`Error in "uploadDatabaseDump" when uploading ${type} backup`, {
          additional: error.message,
        })
      }
    }
  }
}

function schedule() {
  cron.schedule('00 00 * * *', function () {
    uploadDatabaseDump('daily')
  })

  cron.schedule('00 00 * * 0', function () {
    uploadDatabaseDump('weekly')
  })

  cron.schedule('00 00 1 * *', function () {
    uploadDatabaseDump('monthly')
  })
}

if (argv.daemon) {
  schedule()
} else if (argv.backup && argv.file) {
  console.log('restore from backup with file')
} else if (argv.backup) {
  restoreDatabaseFromDump(false, {
    username: 'admin',
    password: 'qas87W5jfxD4GR6r',
  })
} else if (argv.dump) {
  uploadDatabaseDump('none', true)
} else {
  schedule()
}
