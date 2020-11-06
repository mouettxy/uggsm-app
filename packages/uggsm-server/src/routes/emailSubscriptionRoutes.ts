import { IEmailSubscriptionController } from './../interfaces/IEmailSubscriptionController'
import { EmailSubscriptionController } from '../controllers'
import BaseRouter from './heplers/BaseRouter'

export class EmailSubscriptionRouter extends BaseRouter<IEmailSubscriptionController> {
  constructor() {
    super(EmailSubscriptionController, '/email-subscriptions')
  }

  initializeRoutes() {
    this.expressRouter
      .get(`${this.basePath}`, this.controller.getAll)
      .post(`${this.basePath}`, this.controller.create)
      .delete(`${this.basePath}/:id`, this.controller.delete)
  }
}
