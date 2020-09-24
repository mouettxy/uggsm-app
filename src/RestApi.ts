import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { Router } from './interfaces'
import { errorMiddleware } from './middlewares'
import * as endpointValidationMiddleware from './middlewares/validators/validateEndpoint'
import { connectToDatabase } from './utils'

class RestApi {
  public expressApp: express.Application = express()

  constructor(router: Router[]) {
    connectToDatabase()
    this.initializeMiddlewares()
    this.initializeRouter(router)
    this.initializeErrorHandling()
  }

  public listen(): void {
    this.expressApp.listen(process.env.PORT)
    console.log('server listens on ' + process.env.PORT + ' port')
  }

  private initializeRouter(routers: Router[]): void {
    routers.forEach(router => {
      this.expressApp.use('/v1/', router.expressRouter)
    })
  }

  private initializeMiddlewares(): void {
    this.expressApp.use(bodyParser.json())
    this.expressApp.use(cookieParser())
  }

  private initializeErrorHandling(): void {
    this.expressApp.use(endpointValidationMiddleware.endpoint)
    this.expressApp.use(errorMiddleware)
  }
}

export default RestApi
