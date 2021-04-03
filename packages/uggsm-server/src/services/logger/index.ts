import { createLogger, format, transports } from 'winston'
import path from 'path'

export const getLogsPath = (filename: string) => {
  return process.env.NODE_ENV === 'production' ? '/var/logs/' : path.join(process.cwd(), `/logs/${filename}.log`)
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors()
  ),
  defaultMeta: { service: 'uggsm' },
  transports: [
    new transports.File({ filename: getLogsPath('uggsm-error'), level: 'error' }),
    new transports.File({ filename: getLogsPath('uggsm-combined'), level: 'info' }),
  ],
})

export default logger
