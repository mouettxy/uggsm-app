import express from 'express'
import { ClientController } from '../controllers'
import { IClientController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'
import * as validateClient from '../middlewares/validators/validateClient'

export class ClientRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const clientController = new ClientController()
    this.initializeRoutes(clientController)
  }

  public initializeRoutes(controller: IClientController): void {
    const path = '/client'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/:id`, controller.getById)
      .post(`${path}`, validateClient.client, controller.create)
      .put(`${path}/:id`, validateClient.client, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
