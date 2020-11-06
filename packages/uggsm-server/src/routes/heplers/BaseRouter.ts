import express from 'express'
import { authenticationMiddleware } from '../../middlewares'
import { Router } from '../../interfaces'
export class BaseRouter<T> implements Router {
  public expressRouter: express.Router = express.Router()
  public basePath = ''
  public controller: T | null = null

  constructor(Controller: new () => T | null, basePath: string) {
    if (Controller && basePath) {
      this.basePath = basePath
      this.controller = new Controller()
      this.expressRouter.all(`${this.basePath}*`, authenticationMiddleware)
      this.initializeRoutes()
    } else {
      throw new Error('Controller or base path is not specified')
    }
  }

  initializeRoutes() {
    throw new Error('Routes not specified')
  }

  prefixed(route: string) {
    return `${this.basePath}/${route}`
  }
}

export default BaseRouter
