import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { Router } from './interfaces'
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

expressWinston.requestWhitelist.push('body', 'params')

class RestApi {
  public expressApp: express.Application = express()
  public io: SocketIO.Server | null = null
  public server: any = null

  constructor(router: Router[]) {
    connectToDatabase()
    this.initializeSocketIO()
    this.initializeMiddlewares()
    this.initializeRouter(router)
    this.initializeErrorHandling()
  }

  private initializeSocketIO() {
    const options = {}
    this.server = http.createServer(this.expressApp)
    this.io = SocketIO(this.server, options)
  }

  public listen(): void {
    this.server.listen(process.env.PORT)
    console.log('server listens on ' + process.env.PORT + ' port')
  }

  private initializeRouter(routers: Router[]): void {
    routers.forEach((router) => {
      this.expressApp.use('/v1/', router.expressRouter)
    })
  }

  private initializeMiddlewares(): void {
    // @ts-ignore
    const transport = new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, 'uggsm-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      frequency: '24h',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '7d',
    })

    this.expressApp.use(cors())
    this.expressApp.use(bodyParser.json())
    this.expressApp.use(cookieParser())
    this.expressApp.use(
      expressWinston.logger({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.errors({ stack: true })
        ),
        transports: [transport],
        msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
        expressFormat: true,
      })
    )
  }

  private initializeErrorHandling(): void {
    // @ts-ignore
    const transport = new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, 'uggsm-error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD-HH',
      frequency: '24h',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '7d',
    })

    this.expressApp.use(
      expressWinston.errorLogger({
        transports: [transport],
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.prettyPrint()
        ),
      })
    )

    this.expressApp.use(endpointValidationMiddleware.endpoint)
    this.expressApp.use(errorMiddleware)
  }
}

export default RestApi
