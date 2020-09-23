import { NextFunction } from 'connect'
import express from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'
import { body, validationResult } from 'express-validator/check'
import { OfficeModel, UserModel } from '../../models'

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

export const sms = (): RequestHandlerParams => [...requiredFieldsHelper('message'), badRequestHelper()]

export const completedWork = (): RequestHandlerParams => [
  ...requiredFieldsHelper('message'),
  body('userid').custom(value => {
    let query = UserModel.find({ id: value })
    return query.exec().then(user => {
      if (user.length === 0) {
        return Promise.reject('Неверно указан ID пользователя')
      }
    })
  }),
  badRequestHelper(),
]

export const masterComment = (): RequestHandlerParams => [
  ...requiredFieldsHelper('message'),
  body('userid').custom(value => {
    let query = UserModel.find({ id: value })
    return query.exec().then(user => {
      if (user.length === 0) {
        return Promise.reject('Неверно указан ID пользователя')
      }
    })
  }),
  badRequestHelper(),
]

export const managerComment = (): RequestHandlerParams => [
  ...requiredFieldsHelper('message'),
  body('userid').custom(value => {
    let query = UserModel.find({ id: value })
    return query.exec().then(user => {
      if (user.length === 0) {
        return Promise.reject('Неверно указан ID пользователя')
      }
    })
  }),
  badRequestHelper(),
]

export const workflow = (): RequestHandlerParams => [...requiredFieldsHelper('message'), badRequestHelper()]

export const status = (): RequestHandlerParams => [...requiredFieldsHelper('status'), badRequestHelper()]

export const payed = (): RequestHandlerParams => [...requiredFieldsHelper('payed'), badRequestHelper()]

export const master = (): RequestHandlerParams => [
  ...requiredFieldsHelper('master'),
  body('master').custom(value => {
    let query = UserModel.find({ id: value })
    return query.exec().then(user => {
      if (user.length === 0) {
        return Promise.reject('Неверно указан ID пользователя')
      }

      if (user[0].role !== 'Master') {
        return Promise.reject('Указанный пользователь не является мастером')
      }
    })
  }),
  badRequestHelper(),
]

export const manager = (): RequestHandlerParams => [
  ...requiredFieldsHelper('manager'),
  body('manager').custom(value => {
    let query = UserModel.find({ id: value })
    return query.exec().then(user => {
      if (user.length === 0) {
        return Promise.reject('Неверно указан ID пользователя')
      }

      if (user[0].role !== 'Manager') {
        return Promise.reject('Указанный пользователь не является менеджером')
      }
    })
  }),
  badRequestHelper(),
]

export const office = (): RequestHandlerParams => [
  ...requiredFieldsHelper('office'),
  body('office').custom(value => {
    let office = OfficeModel.getOneByCode(value)
    return office.then(office_ => {
      if (!office_) {
        return Promise.reject('Неверно указан код офиса')
      }
    })
  }),
  badRequestHelper(),
]

export const order: RequestHandlerParams = [
  ...requiredFieldsHelper('customer', 'customerPhone', 'phoneModel', 'serialNumber', 'declaredDefect', 'overallKit'),
  badRequestHelper(),
]
