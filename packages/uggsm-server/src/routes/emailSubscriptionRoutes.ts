import { IEmailSubscriptionController } from './../interfaces/IEmailSubscriptionController'
import { EmailSubscriptionController } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'

export class EmailSubscriptionRouter extends Router<IEmailSubscriptionController> {
  constructor() {
    super(EmailSubscriptionController, '/email-subscriptions', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: '',
        description: 'Получить все e-mail подписки',
        controllerMethod: 'getAll',
        method: 'get',
      },
      {
        path: '',
        description: 'Создать e-mail подписку',
        controllerMethod: 'create',
        method: 'post',
      },
      {
        path: ':id',
        description: 'Удалить e-mail подписку',
        controllerMethod: 'delete',
        method: 'delete',
      },
    ])
  }
}
