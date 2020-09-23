import { NextFunction } from 'connect'
import express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'

export const userLoginValidationMiddleware: RequestHandlerParams = [
  body('password')
    .exists()
    .withMessage('value is required')
    .isString()
    .withMessage('value should be a string'),

  body('username')
    .exists()
    .withMessage('value is required')
    .isString()
    .withMessage('value should be a string'),

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
