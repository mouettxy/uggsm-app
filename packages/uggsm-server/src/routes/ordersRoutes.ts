import { OrdersController } from '../controllers'
import { IOrdersController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import * as orderValidators from '../middlewares/validators/validateOrder'
import { AccessEntryAction } from '../models'
import { collectAccessMiddleware } from '../middlewares'

const collectAccessFactory = (action: AccessEntryAction): [AccessEntryAction, AccessEntryAction] => {
  return [
    {
      id: 'Order',
      value: 'Заказы',
    },
    action,
  ]
}

export class OrdersRouter extends Router<IOrdersController> {
  constructor() {
    super(OrdersController, '/order', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'reports/report',
        description: 'Сгенерировать отчёт',
        controllerMethod: 'generateReport',
        method: 'get',
      },
      {
        path: ':id',
        description: 'Получить заказ по ID',
        controllerMethod: 'getById',
        method: 'get',
      },
    ])

    this.addRoutes([
      {
        path: 'paginated',
        description: 'Получить заказы с пагинацией',
        controllerMethod: 'getPaginated',
        method: 'post',
      },
      {
        path: 'office/:code',
        description: 'Создать заказ',
        controllerMethod: 'createByOffice',
        method: 'post',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'createByOffice',
              value: 'Создал заказ',
            })
          ),
        ],
      },
    ])

    this.addRoutes([
      {
        path: ':id/sms',
        description: 'Добавить смс к заказу',
        controllerMethod: 'addSms',
        method: 'put',
        validators: [orderValidators.sms],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'addSms',
              value: 'Добавил смс к заказу',
            })
          ),
        ],
      },
      {
        path: ':id/estimated-close-time',
        description: 'Установить ориентировочное время закрытия заказа',
        controllerMethod: 'setEstimatedCloseAt',
        method: 'put',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setEstimatedCloseAt',
              value: 'Установил ориентировочное время закрытия заказа',
            })
          ),
        ],
      },
      {
        path: ':id/used-detail',
        description: 'Добавить используемую запчасть',
        controllerMethod: 'addUsedDetail',
        method: 'put',
        validators: [orderValidators.usedDetail],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'addUsedDetail',
              value: 'Добавил используемую запчасть',
            })
          ),
        ],
      },
      {
        path: ':id/completed-work',
        description: 'Добавить выполненную работу',
        controllerMethod: 'addCompletedWork',
        method: 'put',
        validators: [orderValidators.completedWork],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'addCompletedWork',
              value: 'Добавил выполненную работу',
            })
          ),
        ],
      },
      {
        path: ':id/master-comment',
        description: 'Добавить комментарий мастера',
        controllerMethod: 'addMasterComment',
        method: 'put',
        validators: [orderValidators.masterComment],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'addMasterComment',
              value: 'Добавил комментарий мастера',
            })
          ),
        ],
      },
      {
        path: ':id/manager-comment',
        description: 'Добавить комментарий менеджера',
        controllerMethod: 'addManagerComment',
        method: 'put',
        validators: [orderValidators.managerComment],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'addManagerComment',
              value: 'Добавил комментарий менеджера',
            })
          ),
        ],
      },
      {
        path: ':id/status',
        description: 'Установить статус',
        controllerMethod: 'setStatus',
        method: 'put',
        validators: [orderValidators.status],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setStatus',
              value: 'Установил статус',
            })
          ),
        ],
      },
      {
        path: ':id/payed',
        description: 'Установить статус оплаты',
        controllerMethod: 'setPayed',
        method: 'put',
        validators: [orderValidators.payed],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setPayed',
              value: 'Установил статус оплаты',
            })
          ),
        ],
      },
      {
        path: ':id/master',
        description: 'Установить мастера',
        controllerMethod: 'setMaster',
        method: 'put',
        validators: [orderValidators.master],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setMaster',
              value: 'Установил мастера',
            })
          ),
        ],
      },
      {
        path: ':id/manager',
        description: 'Установить менеджера',
        controllerMethod: 'setManager',
        method: 'put',
        validators: [orderValidators.manager],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setManager',
              value: 'Установил менеджера',
            })
          ),
        ],
      },
      {
        path: ':id/office',
        description: 'Установить офис',
        controllerMethod: 'setOffice',
        method: 'put',
        validators: [orderValidators.office],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'setOffice',
              value: 'Установил офис',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Обновить по ID',
        controllerMethod: 'updateById',
        method: 'put',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'updateById',
              value: 'Обновил заказ',
            })
          ),
        ],
      },
    ])

    this.addRoutes([
      {
        path: ':id',
        description: 'Удалить заказ',
        controllerMethod: 'deleteById',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteById',
              value: 'Удалил заказ',
            })
          ),
        ],
      },
      {
        path: ':id/completed-work/:workId',
        description: 'Удалить добавленную работу',
        controllerMethod: 'deleteCompletedWork',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteCompletedWork',
              value: 'Удалил выполненную работу',
            })
          ),
        ],
      },
    ])
  }
}
