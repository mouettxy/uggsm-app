import { ICallsController } from 'src/interfaces'
import { CallsController } from '../controllers'
import BaseRouter from './heplers/BaseRouter'

export class CallsRouter extends BaseRouter<ICallsController> {
  constructor() {
    super(CallsController, '/calls')
  }

  initializeRoutes() {
    this.expressRouter
      .get(this.prefixed('paginated'), this.controller.getPaginated)
      .post(this.prefixed('callbacks/call-start'), this.controller.callbackCallStart)
      .post(this.prefixed('callbacks/call-answer'), this.controller.callbackCallAnswer)
      .post(this.prefixed('callbacks/call-finish'), this.controller.callbackCallFinish)
  }
}
