import { ControllerMethod } from './controller'

export interface ICallsController {
  getPaginated: ControllerMethod
  callbackCallStart: ControllerMethod
  callbackCallAnswer: ControllerMethod
  callbackCallFinish: ControllerMethod
}
