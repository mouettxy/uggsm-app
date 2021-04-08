import { CashController } from '../controllers/cashController'
import { ICashController } from '../interfaces'
import { ExtendedRouter } from './heplers/BaseRouter'

export class CashRouter extends ExtendedRouter<ICashController> {
  constructor() {
    super(CashController, '/cash', true)
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
