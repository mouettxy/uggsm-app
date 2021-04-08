import { ControllerMethod } from './controller'

export type ICallbackController = {
  smsCallback: ControllerMethod
  callStartCallback: ControllerMethod
  callAnswerCallback: ControllerMethod
  callFinishCallback: ControllerMethod
}
