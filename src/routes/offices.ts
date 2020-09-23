import express from 'express'
import { OfficeControler } from '../controllers'
import { Controller, Router } from '../interfaces'
import {
  authenticationMiddleware,
  officeValidationMiddleware,
} from '../middlewares'

export class OfficeRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const officeControler = new OfficeControler()
    this.initializeRoutes(officeControler)
  }

  public initializeRoutes(controller: Controller): void {
    const path = '/office'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:code`, controller.getByCode)
      .post(path, officeValidationMiddleware, controller.create)
      .put(`${path}/:id`, officeValidationMiddleware, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
