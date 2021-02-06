import express from 'express'
import { UsersController } from '../controllers'
import { IUserController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'
import * as validateUser from '../middlewares/validators/validateUser'

export class UsersRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const userController = new UsersController()
    this.initializeRoutes(userController)
  }

  public initializeRoutes(controller: IUserController): void {
    const path = '/user'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:id`, controller.getById)
      .post(path, validateUser.user, controller.create)
      .put(`${path}/:id`, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
