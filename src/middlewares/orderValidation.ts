import { NextFunction } from 'connect'
import * as express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'

export const orderValidationMiddleware: RequestHandlerParams = [
  body('customer')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('customerPhone')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('branchOffise')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('status')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

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
