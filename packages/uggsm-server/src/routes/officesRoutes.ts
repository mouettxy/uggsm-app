import { OfficeController } from '../controllers'
import { IOfficeController } from '../interfaces'
import { ExtendedRouter } from './heplers/BaseRouter'
import * as officeValidator from '../middlewares/validators/validateOffice'

export class OfficeRouter extends ExtendedRouter<IOfficeController> {
  constructor() {
    super(OfficeController, '/office', true)
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
      },
      {
        path: ':id',
        description: 'Обновить офис по ID',
        controllerMethod: 'updateById',
        method: 'put',
        validators: [officeValidator.office],
      },
      {
        path: ':id',
        description: 'Удалить офис по ID',
        controllerMethod: 'deleteById',
        method: 'delete',
      },
    ])
  }
}
