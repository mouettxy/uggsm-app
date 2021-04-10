import { NextFunction, Response } from 'express'
import { HttpException } from '../exceptions'

export class BaseController {
  public success(res: Response, data: any = '') {
    res.status(200).send(data)
  }

  public badRequest(next: NextFunction, message = 'Невалидные данные') {
    next(new HttpException(400, message))
  }

  public criticalError(next: NextFunction, message = 'Ошибка сервера') {
    next(new HttpException(500, message))
  }
}

export default BaseController
