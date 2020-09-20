import { NextFunction } from 'connect'
import * as express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'
import { roles } from '../models/user'

export const userValidationMiddleware: RequestHandlerParams = [
  body('username')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('password')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('credentials')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('branchOffice')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('role')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле')
    .isIn(roles)
    .withMessage('Должно соответствовать значениям: ' + roles),

  (req: express.Request, res: express.Response, next: NextFunction): void => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        status: 400,
        message: 'Bad Request',
        errors: validationErrors.array(),
      })
    } else {
      next()
    }
  },
]
