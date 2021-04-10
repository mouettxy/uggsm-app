import { RolesController } from '../controllers'
import { IRolesController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import { AccessEntryAction } from '../models'
import { collectAccessMiddleware } from '../middlewares'

const collectAccessFactory = (action: AccessEntryAction): [AccessEntryAction, AccessEntryAction] => {
  return [
    {
      id: 'Role',
      value: 'Роли',
    },
    action,
  ]
}
export class RolesRouter extends Router<IRolesController> {
  constructor() {
    super(RolesController, '/role', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: '',
        description: 'Получает все роли',
        controllerMethod: 'get',
        method: 'get',
      },
      {
        path: 'static/:type',
        description: 'Получает статику',
        controllerMethod: 'getStatic',
        method: 'get',
      },
      {
        path: ':role',
        description: 'Получить роль',
        controllerMethod: 'getOne',
        method: 'get',
      },
      {
        path: '',
        description: 'Создать роль',
        controllerMethod: 'create',
        method: 'post',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'create',
              value: 'Создал роль',
            })
          ),
        ],
      },
      {
        path: ':role',
        description: 'Обновить роль',
        controllerMethod: 'update',
        method: 'put',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'update',
              value: 'Обновил роль',
            })
          ),
        ],
      },
      {
        path: ':role',
        description: 'Удалить роль',
        controllerMethod: 'delete',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'delete',
              value: 'Удалил роль',
            })
          ),
        ],
      },
      {
        path: ':role/ability',
        description: 'Создать способность',
        controllerMethod: 'createAbility',
        method: 'post',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'createAbility',
              value: 'Создал способность',
            })
          ),
        ],
      },
      {
        path: ':role/ability/:ability',
        description: 'Обновить способность',
        controllerMethod: 'updateAbility',
        method: 'put',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'updateAbility',
              value: 'Обновил способность',
            })
          ),
        ],
      },
      {
        path: ':role/ability/:ability',
        description: 'Удалить способность',
        controllerMethod: 'deleteAbility',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteAbility',
              value: 'Удалил способность',
            })
          ),
        ],
      },
    ])
  }
}
