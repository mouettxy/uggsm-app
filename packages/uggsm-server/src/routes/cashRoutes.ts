import { CashController } from '../controllers/cashController'
import { ICashController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

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
      },
      {
        path: ':id',
        description: 'Обновить кассу по ID',
        controllerMethod: 'updateById',
        method: 'put',
      },
      {
        path: ':id',
        description: 'Удалить кассу по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
      },
    ])
  }
}
