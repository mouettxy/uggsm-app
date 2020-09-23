import { NextFunction } from 'connect'
import express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'

export const officeValidationMiddleware: RequestHandlerParams = [
  body('code')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('name')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('address')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('ordersTemplate')
    .not()
    .isEmpty()
    .withMessage('Необходимое поле'),

  body('docsTemplate')
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
