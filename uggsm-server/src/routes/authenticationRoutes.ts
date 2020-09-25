import express from 'express'
import { IAuthentificationController, Router } from '../interfaces'
import { AuthenticationController } from '../controllers'
import { authenticationMiddleware } from '../middlewares'
import * as validateUserLogin from '../middlewares/validators/validateUserLogin'
import * as validateUser from '../middlewares/validators/validateUser'

export class AuthenticationRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const authController = new AuthenticationController()
    this.initializeRoutes(authController)
  }

  public initializeRoutes(controller: IAuthentificationController): void {
    const path = '/auth'

    this.expressRouter.post(`${path}/register`, authenticationMiddleware, validateUser.user, controller.register)
    this.expressRouter.post(`${path}/login`, validateUserLogin.userLogin, controller.login)
    this.expressRouter.post(`${path}/logout`, controller.logout)
  }
}
