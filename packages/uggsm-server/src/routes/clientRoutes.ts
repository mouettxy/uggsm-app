import { IClientController } from '../interfaces'
import { ClientController } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import * as clientValidator from '../middlewares/validators/validateClient'
import { AccessEntryAction } from '../models'
import { collectAccessMiddleware } from '../middlewares'

const collectAccessFactory = (action: AccessEntryAction): [AccessEntryAction, AccessEntryAction] => {
  return [
    {
      id: 'Client',
      value: 'Клиенты',
    },
    action,
  ]
}
export class ClientRouter extends Router<IClientController> {
  constructor() {
    super(ClientController, '/client', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: '',
        description: 'Получить всех клиентов',
        controllerMethod: 'getAll',
        method: 'get',
      },
      {
        path: 'paginated',
        description: 'Получить клиентов с пагинацией',
        controllerMethod: 'getPaginated',
        method: 'post',
      },
      {
        path: ':id',
        description: 'Получить клиента по ID',
        controllerMethod: 'getById',
        method: 'get',
      },
      {
        path: 'name/:name',
        description: 'Получить клиента по имени',
        controllerMethod: 'getByName',
        method: 'get',
      },
      {
        path: '',
        description: 'Создать клиента по ID',
        controllerMethod: 'create',
        method: 'post',
        validators: [clientValidator.client],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'create',
              value: 'Создал клиента',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Обновить клиента по ID',
        controllerMethod: 'updateById',
        method: 'put',
        validators: [clientValidator.client],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'updateById',
              value: 'Обновил клиента',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Удалить клиента по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteById',
              value: 'Удалил клиента',
            })
          ),
        ],
      },
    ])
  }
}
