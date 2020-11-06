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

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.prettyPrint()),
    })
  )
}

export default logger