import { UsersController } from '../controllers'
import { IUserController } from '../interfaces'
import { ExtendedRouter } from './heplers/BaseRouter'

export class UsersRouter extends ExtendedRouter<IUserController> {
  constructor() {
    super(UsersController, '/user', false)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: '',
        description: 'Получить всех пользователей',
        controllerMethod: 'get',
        method: 'get',
      },
      {
        path: 'paginated',
        description: 'Постраничная навигация',
        controllerMethod: 'getPaginated',
        method: 'post',
      },
      {
        path: ':id',
        description: 'Получить пользователя по ID',
        controllerMethod: 'getOne',
        method: 'get',
      },
      {
        path: ':id',
        description: 'Обновить пользователя по ID',
        controllerMethod: 'update',
        method: 'put',
      },
      {
        path: ':id',
        description: 'Удалить пользователя по ID',
        controllerMethod: 'delete',
        method: 'delete',
      },
    ])
  }
}
