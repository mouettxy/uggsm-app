import express from 'express'
import { authenticationMiddleware } from '../../middlewares'
import { mongoose } from '@typegoose/typegoose'
import { Router } from '../../interfaces/'

export class BaseRouter implements Router {
  public expressRouter: express.Router = express.Router()
  public basePath = ''
  public controller = null

  constructor(controller: any, basePath: string) {
    if (controller && basePath) {
      this.basePath = basePath
      this.controller = new controller()
      this.expressRouter.all(`${this.basePath}*`, authenticationMiddleware)
      this.initializeRoutes()
    } else {
      throw new Error('Controller not specified')
    }
  }

  initializeRoutes() {
    throw new Error('Routes not specified')
  }
}

export default BaseRouter
