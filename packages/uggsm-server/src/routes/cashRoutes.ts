import { CashController } from '../controllers/cashController'
import { ICashController } from '../interfaces'
import BaseRouter from './heplers/BaseRouter'

export class CashRouter extends BaseRouter<ICashController> {
  constructor() {
    super(CashController, '/cash')
  }

  public initializeRoutes() {
    this.expressRouter
      .get(this.basePath, this.controller.getAll)
      .post(this.prefixed('paginated'), this.controller.getPaginated)
      .get(this.prefixed('total-filtered'), this.controller.getTotalByFilter)
      .get(this.prefixed('balance/:office'), this.controller.getBalance)
      .get(this.prefixed(':code'), this.controller.getAllByOffice)
      .get(this.prefixed('order/:id'), this.controller.getByOrder)
      .post(this.prefixed(':code'), this.controller.createByOffice)
      .put(this.prefixed(':id'), this.controller.updateById)
      .delete(this.prefixed(':id'), this.controller.deleteById)
  }
}
