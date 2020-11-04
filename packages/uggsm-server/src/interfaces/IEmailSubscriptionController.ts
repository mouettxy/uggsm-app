import { ControllerMethod } from './controller'

export interface IEmailSubscriptionController {
  getAll: ControllerMethod
  create: ControllerMethod
  delete: ControllerMethod
}
