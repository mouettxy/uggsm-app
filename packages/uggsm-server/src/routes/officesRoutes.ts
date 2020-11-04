import express from 'express'
import { OfficeController } from '../controllers'
import { IOfficeController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'
import * as validateOffice from '../middlewares/validators/validateOffice'

export class OfficeRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const officeController = new OfficeController()
    this.initializeRoutes(officeController)
  }

  public initializeRoutes(controller: IOfficeController): void {
    const path = '/office'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:code`, controller.getByCode)
      .post(path, validateOffice.office, controller.create)
      .put(`${path}/:id`, validateOffice.office, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
