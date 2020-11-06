import { ControllerMethod } from './controller'

export interface ICallsController {
  callbackCallStart: ControllerMethod
  callbackCallAnswer: ControllerMethod
  callbackCallFinish: ControllerMethod
}
