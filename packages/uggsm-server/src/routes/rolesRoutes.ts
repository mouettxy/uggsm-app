import { RolesController } from '../controllers'
import { IRolesController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

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
      },
      {
        path: ':role',
        description: 'Обновить роль',
        controllerMethod: 'update',
        method: 'put',
      },
      {
        path: ':role',
        description: 'Удалить роль',
        controllerMethod: 'delete',
        method: 'delete',
      },
      {
        path: ':role/ability',
        description: 'Создать способность',
        controllerMethod: 'createAbility',
        method: 'post',
      },
      {
        path: ':role/ability/:ability',
        description: 'Обновить способность',
        controllerMethod: 'updateAbility',
        method: 'put',
      },
      {
        path: ':role/ability/:ability',
        description: 'Удалить способность',
        controllerMethod: 'deleteAbility',
        method: 'delete',
      },
    ])
  }
}
