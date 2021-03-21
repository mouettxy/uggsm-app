import { ICallsController } from 'src/interfaces'
import { CallsController } from '../controllers'
import { ExtendedRouter } from './heplers/BaseRouter'

export class CallsRouter extends ExtendedRouter<ICallsController> {
  constructor() {
    super(CallsController, '/calls', false)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'paginated',
        description: 'Получить все звонки',
        controllerMethod: 'getPaginated',
        method: 'get',
      },
      {
        path: 'paginated',
        description: 'Получить все звонки',
        controllerMethod: 'getPaginatedNew',
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
