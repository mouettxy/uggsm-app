import { ICallsController } from '../interfaces'
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
    ])
  }
}
