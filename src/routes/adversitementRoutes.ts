import express from 'express'
import { AdversitementController } from '../controllers'
import { IAdversitementController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'
import * as validateAdversitement from '../middlewares/validators/validateAdversitement'

export class AdversitementRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const cashController = new AdversitementController()
    this.initializeRoutes(cashController)
  }

  public initializeRoutes(controller: IAdversitementController): void {
    const path = '/adversitement'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:id`, controller.getById)
      .post(`${path}`, validateAdversitement.adversitement, controller.create)
      .put(`${path}/:id`, validateAdversitement.adversitement, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
