import { CallbackController } from '../controllers'
import { ICallbackController } from '../interfaces'
import { ExtendedRouter } from './heplers/BaseRouter'

export class CallbackRouter extends ExtendedRouter<ICallbackController> {
  constructor() {
    super(CallbackController, '', false)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'order/sms/callback',
        description: 'REDSMS Sms Callback',
        controllerMethod: 'smsCallback',
        method: 'post',
      },
    ])
  }
}
