import { HttpException } from './../exceptions/HttpException'
import { ControllerMethod } from './../interfaces/controller'
import { ICallsController } from '../interfaces/ICallsController'
import { NextFunction } from 'express'

class BaseController {
  public criticalError(next: NextFunction, message = 'Ошибка сервера') {
    next(new HttpException(500, message))
  }
}

type CallsWebhookRequest<Event> = {
  webhook: {
    action: 'call.start' | 'call.finish' | 'call.answer'
    account_id: string
    account_name: string
    user_id: string
    user_login: string
  }
  event: Event
}

type CallsWebhookCallStandart = {
  results_count: number
  results_remains: number
  results: [
    {
      direction: number
      event_type: 1 | 2 | 4
      client_number: string
      client_name: string
      event_age: number
      event_created: number
      event_pbx_call_id: string
    }
  ]
}

type CallsWebhookCallExtended = {
  start_time: number
  answer_time: number
  end_time: number
  duration: number
  answered: 0 | 1
  recording: string
  db_call_id: number | string
}

type CallsWebhookCallStart = CallsWebhookRequest<CallsWebhookCallStandart>

type CallsWebhookCallAnwer = CallsWebhookRequest<CallsWebhookCallStandart>

type CallsWebhookCallFinish = CallsWebhookRequest<CallsWebhookCallStandart & CallsWebhookCallExtended>

export class CallsController extends BaseController implements ICallsController {
  public callbackCallStart: ControllerMethod = async (req, res, next) => {
    this.criticalError(next)
  }

  public callbackCallAnswer: ControllerMethod = async (req, res, next) => {
    this.criticalError(next)
  }

  public callbackCallFinish: ControllerMethod = async (req, res, next) => {
    this.criticalError(next)
  }
}
