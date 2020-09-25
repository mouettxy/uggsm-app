import { NextFunction } from 'connect'
import express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'
const requiredFieldsHelper = (...args: string[]) => {
  const fields = []
  args.forEach(e => {
    fields.push(
      body(e)
        .not()
        .isEmpty()
        .withMessage('Необходимое поле'),
    )
  })
  return fields
}

const badRequestHelper = () => {
  return (req: express.Request, res: express.Response, next: NextFunction): void => {
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
  }
}

export const sms: RequestHandlerParams = [...requiredFieldsHelper('message'), badRequestHelper()]

export const completedWork: RequestHandlerParams = [...requiredFieldsHelper('message'), badRequestHelper()]

export const masterComment: RequestHandlerParams = [...requiredFieldsHelper('message'), badRequestHelper()]

export const managerComment: RequestHandlerParams = [...requiredFieldsHelper('message'), badRequestHelper()]

export const workflow: RequestHandlerParams = [...requiredFieldsHelper('message'), badRequestHelper()]

export const status: RequestHandlerParams = [...requiredFieldsHelper('status'), badRequestHelper()]

export const payed: RequestHandlerParams = [...requiredFieldsHelper('payed'), badRequestHelper()]

export const master: RequestHandlerParams = [...requiredFieldsHelper('master'), badRequestHelper()]

export const manager: RequestHandlerParams = [...requiredFieldsHelper('manager'), badRequestHelper()]

export const office: RequestHandlerParams = [...requiredFieldsHelper('office'), badRequestHelper()]

export const order: RequestHandlerParams = [
  ...requiredFieldsHelper(
    'customerName',
    'customerPhone',
    'phoneModel',
    'serialNumber',
    'declaredDefect',
    'overallKit',
  ),
  badRequestHelper(),
]
