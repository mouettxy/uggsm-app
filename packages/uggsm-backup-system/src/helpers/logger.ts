import { createLogger, format, transports } from 'winston'
import path from 'path'

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'backup-service' },
  transports: [
    new transports.File({ filename: path.join(process.env.SERVER_LOGS_PATH, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(process.env.SERVER_LOGS_PATH, 'error.log') }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  )
}

export default logger
