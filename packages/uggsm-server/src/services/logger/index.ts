import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.prettyPrint()
  ),
  defaultMeta: { service: 'uggsm' },
  transports: [
    new transports.File({ filename: 'uggsm-error.log', level: 'error' }),
    new transports.File({ filename: 'uggsm-combined.log' }),
  ],
})

export default logger
