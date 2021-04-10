import { CashController } from '../controllers/cashController'
import { ICashController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import { AccessEntryAction } from '../models'
import { collectAccessMiddleware } from '../middlewares'

const collectAccessFactory = (action: AccessEntryAction): [AccessEntryAction, AccessEntryAction] => {
  return [
    {
      id: 'Cash',
      value: 'Касса',
    },
    action,
  ]
}

export class CashRouter extends Router<ICashController> {
  constructor() {
    super(CashController, '/cash', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'paginated',
        description: 'Получить кассу с пагинацией',
        controllerMethod: 'getPaginated',
        method: 'post',
      },
      {
        path: 'order/:id',
        description: 'Получить кассу по заказу',
        controllerMethod: 'getByOrder',
        method: 'get',
      },
      {
        path: ':code',
        description: 'Создать кассу по офису',
        controllerMethod: 'createByOffice',
        method: 'post',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'createByOffice',
              value: 'Создал запись в кассу',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Обновить кассу по ID',
        controllerMethod: 'updateById',
        method: 'put',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'updateById',
              value: 'Обновил запись в кассе',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Удалить кассу по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteById',
              value: 'Удалил запись из кассы',
            })
          ),
        ],
      },
    ])
  }
}
