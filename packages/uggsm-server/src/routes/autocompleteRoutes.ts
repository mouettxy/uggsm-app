import { AutocompleteController } from '../controllers'
import { IAutocompleteController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class AutocompleteRouter extends Router<IAutocompleteController> {
  constructor() {
    super(AutocompleteController, '/autocomplete', AUTH_MIDDLEWARE.DISABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'custom',
        description: 'Динамический поиск',
        controllerMethod: 'customAutocomplete',
        method: 'get',
      },
      {
        path: 'customer-name',
        description: 'Имена клиента',
        controllerMethod: 'customerName',
        method: 'get',
      },
      {
        path: 'customer-phone',
        description: 'Телефоны клиента',
        controllerMethod: 'customerPhone',
        method: 'get',
      },
      {
        path: 'phone-brand',
        description: 'Бренды телефона',
        controllerMethod: 'phoneBrand',
        method: 'get',
      },
      {
        path: 'phone-model',
        description: 'Модели телефонов',
        controllerMethod: 'phoneModel',
        method: 'get',
      },
      {
        path: 'declared-defect',
        description: 'Первичные деффекты',
        controllerMethod: 'declaredDefect',
        method: 'get',
      },
      {
        path: 'kit',
        description: 'Комплектации',
        controllerMethod: 'kit',
        method: 'get',
      },
      {
        path: 'users',
        description: 'Пользователи',
        controllerMethod: 'users',
        method: 'get',
      },
      {
        path: 'master',
        description: 'Мастера',
        controllerMethod: 'master',
        method: 'get',
      },
      {
        path: 'manager',
        description: 'Менеджеры',
        controllerMethod: 'manager',
        method: 'get',
      },
      {
        path: 'completed-work',
        description: 'Выполненные работы',
        controllerMethod: 'completedWork',
        method: 'get',
      },
      {
        path: 'offices',
        description: 'Офисы',
        controllerMethod: 'offices',
        method: 'get',
      },
      {
        path: 'roles',
        description: 'Роли',
        controllerMethod: 'roles',
        method: 'get',
      },
      {
        path: 'routes',
        description: 'Ссылки автозаполнения',
        controllerMethod: 'listOfRoutes',
        method: 'get',
      },
    ])
  }
}
