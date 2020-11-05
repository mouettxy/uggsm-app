import { OrdersController } from '../controllers'
import * as validateOrder from '../middlewares/validators/validateOrder'
import BaseRouter from './heplers/BaseRouter'

export class OrdersRouter extends BaseRouter {
  constructor() {
    super(OrdersController, '/order')
  }

  initializeRoutes() {
    this.expressRouter
      .get(this.basePath, this.controller.getAll)
      .get(`${this.basePath}/reports/report`, this.controller.generateReport)
      .get(`${this.basePath}/office/:code`, this.controller.getAllByOffice)
      .get(`${this.basePath}/paginate/`, this.controller.getAllWithParams)
      .get(`${this.basePath}/:id`, this.controller.getById)

      .post(this.basePath, validateOrder.order, this.controller.create)
      .post(`${this.basePath}/sms/callback`, this.controller.smsCallback)
      .post(`${this.basePath}/office/:code`, validateOrder.order, this.controller.createByOffice)

      .put(`${this.basePath}/:id/sms`, validateOrder.sms, this.controller.addSms)
      .put(`${this.basePath}/:id/estimated-close-time`, this.controller.setEstimatedCloseAt)
      .put(`${this.basePath}/:id/completed-work`, validateOrder.completedWork, this.controller.addCompletedWork)
      .put(`${this.basePath}/:id/master-comment`, validateOrder.masterComment, this.controller.addMasterComment)
      .put(`${this.basePath}/:id/manager-comment`, validateOrder.managerComment, this.controller.addManagerComment)
      .put(`${this.basePath}/:id/workflow`, validateOrder.workflow, this.controller.addWorkflow)
      .put(`${this.basePath}/:id/status`, validateOrder.status, this.controller.setStatus)
      .put(`${this.basePath}/:id/payed`, validateOrder.payed, this.controller.setPayed)
      .put(`${this.basePath}/:id/master`, validateOrder.master, this.controller.setMaster)
      .put(`${this.basePath}/:id/manager`, validateOrder.manager, this.controller.setManager)
      .put(`${this.basePath}/:id/office`, validateOrder.office, this.controller.setOffice)
      .put(`${this.basePath}/:id`, this.controller.updateById)

      .delete(`${this.basePath}/:id`, this.controller.deleteById)
      .delete(`${this.basePath}/:id/completed-work/:workId`, this.controller.deleteCompletedWork)
  }
}
