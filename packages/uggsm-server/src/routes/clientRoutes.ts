import { IClientController } from 'src/interfaces'
import { ClientController } from '../controllers'
import * as validateClient from '../middlewares/validators/validateClient'
import BaseRouter from './heplers/BaseRouter'

export class ClientRouter extends BaseRouter<IClientController> {
  constructor() {
    super(ClientController, '/client')
  }

  initializeRoutes() {
    this.expressRouter
      .get(this.basePath, this.controller.getAll)
      .get(`${this.basePath}/paginated`, this.controller.getPaginated)
      .post(`${this.basePath}/paginated`, this.controller.getPaginatedNew)
      .get(`${this.basePath}/:id`, this.controller.getById)
      .get(`${this.basePath}/name/:name`, this.controller.getByName)
      .post(`${this.basePath}`, validateClient.client, this.controller.create)
      .put(`${this.basePath}/:id`, validateClient.client, this.controller.updateById)
      .delete(`${this.basePath}/:id`, this.controller.deleteById)
  }
}
