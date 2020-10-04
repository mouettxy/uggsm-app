import express from 'express'
import { OrdersController } from '../controllers'
import { IOrdersController, Router } from '../interfaces'
import { authenticationMiddleware } from '../middlewares'
import * as validateOrder from '../middlewares/validators/validateOrder'

export class OrdersRouter implements Router {
  public expressRouter: express.Router = express.Router()

  constructor() {
    const orderController = new OrdersController()
    this.initializeRoutes(orderController)
  }

  public initializeRoutes(controller: IOrdersController): void {
    const path = '/order'

    this.expressRouter
      .all(`${path}*`, authenticationMiddleware)
      .get(path, controller.getAll)
      .get(`${path}/office/:code`, controller.getAllByOffice)
      .get(`${path}/paginate/`, controller.getAllWithParams)
      .get(`${path}/:id`, controller.getById)
      .post(path, validateOrder.order, controller.create)
      .post(`${path}/office/:code`, validateOrder.order, controller.createByOffice)
      .put(`${path}/:id/sms`, validateOrder.sms, controller.addSms)
      .put(`${path}/:id/completed-work`, validateOrder.completedWork, controller.addCompletedWork)
      .put(`${path}/:id/master-comment`, validateOrder.masterComment, controller.addMasterComment)
      .put(`${path}/:id/manager-comment`, validateOrder.managerComment, controller.addManagerComment)
      .put(`${path}/:id/workflow`, validateOrder.workflow, controller.addWorkflow)
      .put(`${path}/:id/status`, validateOrder.status, controller.setStatus)
      .put(`${path}/:id/payed`, validateOrder.payed, controller.setPayed)
      .put(`${path}/:id/master`, validateOrder.master, controller.setMaster)
      .put(`${path}/:id/manager`, validateOrder.manager, controller.setManager)
      .put(`${path}/:id/office`, validateOrder.office, controller.setOffice)
      .put(`${path}/:id`, validateOrder.order, controller.updateById)
      .delete(`${path}/:id`, controller.deleteById)
  }
}
