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

      {
        path: 'calls/callbacks/call-start',
        description: 'moizvonki callback call-start',
        controllerMethod: 'callStartCallback',
        method: 'post',
      },
      {
        path: 'calls/callbacks/call-answer',
        description: 'moizvonki callback call-answer',
        controllerMethod: 'callAnswerCallback',
        method: 'post',
      },
      {
        path: 'calls/callbacks/call-finish',
        description: 'moizvonki callback call-finish',
        controllerMethod: 'callFinishCallback',
        method: 'post',
      },
    ])
  }
}
