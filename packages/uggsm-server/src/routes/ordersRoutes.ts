import { OrdersController } from '../controllers'
import { IOrdersController } from '../interfaces'
import { ExtendedRouter } from './heplers/BaseRouter'
import * as orderValidators from '../middlewares/validators/validateOrder'

export class OrdersRouter extends ExtendedRouter<IOrdersController> {
  constructor() {
    super(OrdersController, '/order', true)
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
      },
    ])

    this.addRoutes([
      {
        path: ':id/sms',
        description: 'Добавить смс к заказу',
        controllerMethod: 'addSms',
        method: 'put',
        validators: [orderValidators.sms],
      },
      {
        path: ':id/estimated-close-time',
        description: 'Установить ориентировочное время закрытия заказа',
        controllerMethod: 'setEstimatedCloseAt',
        method: 'put',
      },
      {
        path: ':id/used-detail',
        description: 'Добавить используемую запчасть',
        controllerMethod: 'addUsedDetail',
        method: 'put',
        validators: [orderValidators.usedDetail],
      },
      {
        path: ':id/completed-work',
        description: 'Добавить выполненную работу',
        controllerMethod: 'addCompletedWork',
        method: 'put',
        validators: [orderValidators.completedWork],
      },
      {
        path: ':id/master-comment',
        description: 'Добавить комментарий мастера',
        controllerMethod: 'addMasterComment',
        method: 'put',
        validators: [orderValidators.masterComment],
      },
      {
        path: ':id/manager-comment',
        description: 'Добавить комментарий менеджера',
        controllerMethod: 'addManagerComment',
        method: 'put',
        validators: [orderValidators.managerComment],
      },
      {
        path: ':id/status',
        description: 'Установить статус',
        controllerMethod: 'setStatus',
        method: 'put',
        validators: [orderValidators.status],
      },
      {
        path: ':id/payed',
        description: 'Установить статус оплаты',
        controllerMethod: 'setPayed',
        method: 'put',
        validators: [orderValidators.payed],
      },
      {
        path: ':id/master',
        description: 'Установить мастера',
        controllerMethod: 'setMaster',
        method: 'put',
        validators: [orderValidators.master],
      },
      {
        path: ':id/manager',
        description: 'Установить менеджера',
        controllerMethod: 'setManager',
        method: 'put',
        validators: [orderValidators.manager],
      },
      {
        path: ':id/office',
        description: 'Установить офис',
        controllerMethod: 'setOffice',
        method: 'put',
        validators: [orderValidators.office],
      },
      {
        path: ':id',
        description: 'Обновить по ID',
        controllerMethod: 'updateById',
        method: 'put',
      },
    ])

    this.addRoutes([
      {
        path: ':id',
        description: 'Удалить заказ',
        controllerMethod: 'deleteById',
        method: 'delete',
      },
      {
        path: ':id/completed-work/:workId',
        description: 'Удалить добавленную работу',
        controllerMethod: 'deleteCompletedWork',
        method: 'delete',
      },
    ])
  }
}
