import { ControllerMethod } from './controller'

export interface ICallsController {
  getPaginated: ControllerMethod
  getPaginatedNew: ControllerMethod
  callbackCallStart: ControllerMethod
  callbackCallAnswer: ControllerMethod
  callbackCallFinish: ControllerMethod
}
