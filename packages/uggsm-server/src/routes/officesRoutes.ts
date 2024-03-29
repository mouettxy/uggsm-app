import { OfficeController } from '../controllers'
import { IOfficeController } from '../interfaces'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import * as officeValidator from '../middlewares/validators/validateOffice'
import { AccessEntryAction } from '../models'
import { collectAccessMiddleware } from '../middlewares'

const collectAccessFactory = (action: AccessEntryAction): [AccessEntryAction, AccessEntryAction] => {
  return [
    {
      id: 'Office',
      value: 'Офисы',
    },
    action,
  ]
}
export class OfficeRouter extends Router<IOfficeController> {
  constructor() {
    super(OfficeController, '/office', AUTH_MIDDLEWARE.ENABLE)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: '',
        description: 'Получить всех офисы',
        controllerMethod: 'getAll',
        method: 'get',
      },
      {
        path: ':code',
        description: 'Получить офис по коду',
        controllerMethod: 'getByCode',
        method: 'get',
      },
      {
        path: '',
        description: 'Создать офис',
        controllerMethod: 'create',
        method: 'post',
        validators: [officeValidator.office],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'create',
              value: 'Создал офис',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Обновить офис по ID',
        controllerMethod: 'updateById',
        method: 'put',
        validators: [officeValidator.office],
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'updateById',
              value: 'Обновил офис',
            })
          ),
        ],
      },
      {
        path: ':id',
        description: 'Удалить офис по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
        middlewares: [
          collectAccessMiddleware(
            ...collectAccessFactory({
              id: 'deleteById',
              value: 'Удалил офис',
            })
          ),
        ],
      },
    ])
  }
}
