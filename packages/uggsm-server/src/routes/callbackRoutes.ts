import { CallbackController } from '../controllers'
import { ICallbackController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class CallbackRouter extends Router<ICallbackController> {
  constructor() {
    super(CallbackController, '/callbacks', AUTH_MIDDLEWARE.DISABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'sms',
        description: 'REDSMS Sms Callback',
        controllerMethod: 'smsCallback',
        method: 'post',
      },

      {
        path: 'call-start',
        description: 'moizvonki callback call-start',
        controllerMethod: 'callStartCallback',
        method: 'post',
      },
      {
        path: 'call-answer',
        description: 'moizvonki callback call-answer',
        controllerMethod: 'callAnswerCallback',
        method: 'post',
      },
      {
        path: 'call-finish',
        description: 'moizvonki callback call-finish',
        controllerMethod: 'callFinishCallback',
        method: 'post',
      },
    ])
  }
}
