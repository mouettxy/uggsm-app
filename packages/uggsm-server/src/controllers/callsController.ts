import { HttpException } from './../exceptions/HttpException'
import { ControllerMethod } from './../interfaces/controller'
import { ICallsController } from '../interfaces/ICallsController'

export class CallsController implements ICallsController {
  public callbackCallStart: ControllerMethod = async (req, res, next) => {
    next(new HttpException(500, 'error'))
  }

  public callbackCallAnswer: ControllerMethod = async (req, res, next) => {
    next(new HttpException(500, 'error'))
  }

  public callbackCallFinish: ControllerMethod = async (req, res, next) => {
    next(new HttpException(500, 'error'))
  }
}
