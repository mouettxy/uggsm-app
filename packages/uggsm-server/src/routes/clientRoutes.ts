import { IClientController } from 'src/interfaces'
import { ClientController } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import * as clientValidator from '../middlewares/validators/validateClient'

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
      },
      {
        path: ':id',
        description: 'Обновить клиента по ID',
        controllerMethod: 'updateById',
        method: 'put',
        validators: [clientValidator.client],
      },
      {
        path: ':id',
        description: 'Удалить клиента по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
      },
    ])
  }
}
