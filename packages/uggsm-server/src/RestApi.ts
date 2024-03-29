import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { Router } from './base/Router'
import { errorMiddleware } from './middlewares'
import * as endpointValidationMiddleware from './middlewares/validators/validateEndpoint'
import { connectToDatabase } from './utils'
import SocketIO from 'socket.io'
import http from 'http'
import cors from 'cors'
import winston from 'winston'
import expressWinston from 'express-winston'
import 'winston-daily-rotate-file'
import path from 'path'
import { getLogsPath } from './tools/logger'
import { express as expressUseragent } from 'express-useragent'
import { mw as expressIp } from 'request-ip'

expressWinston.requestWhitelist.push('body', 'params')

type RouterType = Router<any>
class RestApi<T> {
  public expressApp: express.Application = express()

  public io: SocketIO.Server | null = null

  public server: any = null

  public routers: Record<keyof T, RouterType> | null = null

  constructor(routers: Record<keyof T, RouterType>) {
    this.routers = routers

    connectToDatabase()
    this.initializeSocketIO()
    this.initializeMiddlewares()
    this.initializeRouterLogging()
    this.initializeRouter()
    this.initializeErrorHandling()
  }

  private initializeSocketIO() {
    const options = {}
    this.server = http.createServer(this.expressApp)
    this.io = SocketIO(this.server, options)
  }

  public async listen() {
    this.server.listen(process.env.PORT)

    console.log('server listens on ' + process.env.PORT + ' port')
  }

  private initializeRouter(): void {
    for (const key in this.routers) {
      this.expressApp.use('/v1/', this.routers[key].expressRouter)
    }
  }

  private initializeMiddlewares(): void {
    this.expressApp.use(cors())
    this.expressApp.use(bodyParser.json())
    this.expressApp.use(cookieParser())
    this.expressApp.use(expressUseragent())
    this.expressApp.use(expressIp())
  }

  private initializeRouterLogging(): void {
    // @ts-ignore
    const transport = new winston.transports.DailyRotateFile({
      filename: 'uggsm-%DATE%.log',
      dirname: path.join(process.cwd(), '/logs'),
      datePattern: 'YYYY-MM-DD-HH',
      frequency: '24h',
      zippedArchive: true,
      maxSize: '250m',
      maxFiles: '14d',
    })

    this.expressApp.use(
      expressWinston.logger({
        transports: [
          new winston.transports.DailyRotateFile({
            filename: getLogsPath('uggsm-%DATE%'),
            datePattern: 'YYYY-MM-DD-HH',
            frequency: '24h',
            zippedArchive: true,
            maxSize: '250m',
            maxFiles: '14d',
          }),
        ],
        format: winston.format.combine(winston.format.json()),
        meta: true,
        expressFormat: true,
        colorize: false,
      })
    )
  }

  private initializeErrorHandling(): void {
    this.expressApp.use(
      expressWinston.errorLogger({
        transports: [
          new winston.transports.DailyRotateFile({
            filename: getLogsPath('uggsm-error-%DATE%'),
            datePattern: 'YYYY-MM-DD-HH',
            frequency: '24h',
            zippedArchive: true,
            maxSize: '250m',
            maxFiles: '14d',
          }),
        ],
      })
    )

    this.expressApp.use(endpointValidationMiddleware.endpoint)
    this.expressApp.use(errorMiddleware)
  }
}

export default RestApi
