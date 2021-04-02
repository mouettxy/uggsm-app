import { parsePaginationQuery } from '../services/pagination'
import { mongoose } from '@typegoose/typegoose'
import { api } from '../server'
import { NextFunction } from 'connect'
import express from 'express'
import { CashModel } from '../models'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { ICashController } from '../interfaces'
import { OfficeModel } from '../models'
import { ControllerMethod } from '../interfaces/controller'
import BaseController from './base/BaseController'

export class CashController extends BaseController implements ICashController {
  private cash = CashModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.cash
      .find()
      .then((cash) => {
        response.status(200)
        response.send(cash)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getBalance: ControllerMethod = async (req, res, next) => {
    const office = req.params.office

    try {
      const query: any = {
        office,
      }

      const response = await this.cash.findOne(query, 'id balance').sort({ id: -1 })

      this.success(res, { balance: response.balance || 0 })
    } catch (error) {
      this.criticalError(next, error.message)
    }
  }

  public getTotalByFilter: ControllerMethod = async (req, res, next) => {
    const office = req.query.office
    const date = req.query.date
    const cashier = req.query.cashier

    try {
      const query: Record<string, any> = {}

      if (office) {
        query.office = new mongoose.Types.ObjectId(office as string)
      }

      if (date) {
        query.createdAt = {
          $gte: new Date(date[0]),
          $lt: new Date(date[1]),
        }
      }

      if (cashier) {
        query.cashier = new mongoose.Types.ObjectId(cashier as string)
      }

      const response = await this.cash.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            income: {
              $sum: '$income',
            },
            consumption: {
              $sum: '$consumption',
            },
          },
        },
        {
          $project: {
            _id: 0,
            income: 1,
            consumption: 1,
          },
        },
      ])

      this.success(res, response[0] || { income: 0, consumption: 0 })
    } catch (error) {
      this.criticalError(next, error.message)
    }
  }

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.cash, (query) => {
        return {
          ...query,
          office: req.body.office,
        }
      })

      // @ts-ignore
      const response = await this.cash.paginate(query, options)

      const firstCashEntry = await this.cash.findOne(query, 'id balance').sort({ id: -1 })
      const totalBalance = firstCashEntry.balance || 0

      const aggregateCashes = await this.cash.aggregate([
        {
          $match: mongoose.Query.prototype.cast(this.cash, query),
        },
        {
          $group: {
            _id: null,
            income: {
              $sum: '$income',
            },
            consumption: {
              $sum: '$consumption',
            },
          },
        },
        {
          $project: {
            _id: 0,
            income: 1,
            consumption: 1,
          },
        },
      ])

      const aggregateCashesData = aggregateCashes[0] || { income: 0, consumption: 0 }

      response.total = totalBalance
      response.income = aggregateCashesData.income
      response.consumption = aggregateCashesData.consumption

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error.message)
    }
  }

  public getAllByOffice = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const code = request.params.code
    await this.cash
      .find()
      .populate({
        path: 'office',
        match: {
          code,
        },
      })
      .then((cash) => {
        response.status(200)
        cash = cash.filter(function (c) {
          return c.office
        })
        response.send(cash)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getByOrder = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const orderid = Number(request.params.id)
    await this.cash
      .find({ orderid })
      .then((cash) => {
        if (cash) {
          response.status(200)
          response.send(cash)
        } else {
          next(new ObjectNotFoundException(this.cash.modelName, String(orderid)))
        }
      })
      .catch(() =>
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
      )
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.cash
      .findOne({ id })
      .then((cash) => {
        if (cash) {
          response.status(200)
          response.send(cash)
        } else {
          next(new ObjectNotFoundException(this.cash.modelName, id))
        }
      })
      .catch(() =>
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
      )
  }

  public createByOffice = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const cashData = request.body
    const officeCode = request.params.code

    try {
      const office = await OfficeModel.getOneByCode(officeCode)

      if (!office) {
        next(new CannotFindOfficeException(officeCode))
      }

      const cash = new this.cash({
        ...cashData,
        office: office._id,
      })

      const saved = await cash.save()

      response.status(200)
      api.io.emit('created cash', saved)
      api.io.emit('update cashes')
      if (saved.orderid) {
        api.io.emit('update order', saved.orderid)
      }
      response.send(saved)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const id: string = request.params.id
    const cashData = request.body
    await this.cash
      .findOneAndUpdate({ id }, cashData, {
        new: true,
      })
      .then((updatedCash) => {
        if (updatedCash) {
          response.status(200)
          api.io.emit('updated cash', updatedCash)
          api.io.emit('update cashes')
          if (updatedCash.orderid) {
            api.io.emit('update order', updatedCash.orderid)
          }
          response.send(updatedCash)
        } else {
          next(new ObjectNotFoundException(this.cash.modelName, id))
        }
      })
      .catch(() => {
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
      })
  }

  public deleteById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id
    const cash = await this.cash.findOne({ id })
    await this.cash
      .findOneAndDelete({ id })
      .then((successResponse) => {
        if (successResponse) {
          response.status(200)
          api.io.emit('deleted cash', id)
          api.io.emit('update cashes')
          if (cash.orderid) {
            api.io.emit('update order', cash.orderid)
          }
          response.json({
            message: `Запись из кассы с ID ${id} была успешно удалена`,
          })
          response.send()
        } else {
          next(new ObjectNotFoundException(this.cash.modelName, id))
        }
      })
      .catch(() => {
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
      })
  }
}
