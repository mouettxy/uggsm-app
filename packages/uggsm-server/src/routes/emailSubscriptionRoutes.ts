import { IEmailSubscriptionController } from './../interfaces/IEmailSubscriptionController'
import { EmailSubscriptionController } from '../controllers'
import { ExtendedRouter } from './heplers/BaseRouter'

export class EmailSubscriptionRouter extends ExtendedRouter<IEmailSubscriptionController> {
  constructor() {
    super(EmailSubscriptionController, '/email-subscriptions', true)
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
