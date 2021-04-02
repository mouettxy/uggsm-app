import { ControllerMethod } from './controller'

export type ICallsController = {
  getPaginated: ControllerMethod
  callbackCallStart: ControllerMethod
  callbackCallAnswer: ControllerMethod
  callbackCallFinish: ControllerMethod
}
