import express from 'express'
import { CashController } from '../controllers/cashController'
import { ICashController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'

export class CashRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const cashController = new CashController()
    this.initializeRoutes(cashController)
  }

  public initializeRoutes(controller: ICashController): void {
    const path = '/cash'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:code`, controller.getAllByOffice)
      .post(`${path}/:code`, controller.createByOffice)
      .put(`${path}/:id`, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
