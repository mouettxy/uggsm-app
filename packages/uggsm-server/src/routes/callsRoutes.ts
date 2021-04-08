import { ICallsController } from 'src/interfaces'
import { CallsController } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class CallsRouter extends Router<ICallsController> {
  constructor() {
    super(CallsController, '/calls', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'paginated',
        description: 'Получить все звонки',
        controllerMethod: 'getPaginated',
        method: 'post',
      },
      {
        path: 'callbacks/call-start',
        description: 'moizvonki callback call-start',
        controllerMethod: 'callbackCallStart',
        method: 'post',
      },
      {
        path: 'callbacks/call-answer',
        description: 'moizvonki callback call-answer',
        controllerMethod: 'callbackCallAnswer',
        method: 'post',
      },
      {
        path: 'callbacks/call-finish',
        description: 'moizvonki callback call-finish',
        controllerMethod: 'callbackCallFinish',
        method: 'post',
      },
    ])
  }
}
