import { CallbackController } from '../controllers'
import { ICallbackController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class CallbackRouter extends Router<ICallbackController> {
  constructor() {
    super(CallbackController, '', AUTH_MIDDLEWARE.DISABLE)
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
