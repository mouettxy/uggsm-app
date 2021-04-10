import { AccessController, AccessControllerInterface } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class AccessRouter extends Router<AccessControllerInterface> {
  constructor() {
    super(AccessController, '/access', AUTH_MIDDLEWARE.DISABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'paginated',
        description: 'Получает данные доступа с пагинацией',
        controllerMethod: 'getPaginated',
        method: 'get',
      },
      {
        path: '',
        description: 'Получает все данные доступа',
        controllerMethod: 'getAll',
        method: 'get',
      },
      {
        path: ':id',
        description: 'Получает данные доступа по ID',
        controllerMethod: 'getOne',
        method: 'get',
      },
      {
        path: '',
        description: 'Создает данные доступа',
        controllerMethod: 'create',
        method: 'post',
      },
      {
        path: ':id',
        description: 'Обновляет данные доступа',
        controllerMethod: 'update',
        method: 'put',
      },
      {
        path: ':id',
        description: 'Удаляет данные доступа',
        controllerMethod: 'delete',
        method: 'delete',
      },
    ])
  }
}
