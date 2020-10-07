import { NextFunction } from 'connect'
import express from 'express'
import { CashModel } from '../models'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { ICashController } from '../interfaces'
import { OfficeModel } from '../models'

export class CashController implements ICashController {
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

  public getBalance = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const office = request.params.office
    await this.cash
      .find({ office })
      .sort({
        id: 'desc',
      })
      .then((cash) => {
        response.status(200)
        response.send({ balance: cash[0].balance || 0 })
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getPaginated = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const office = request.query.office
    const page = request.query.page
    const limit = request.query.limit
    const query: any = {
      office,
    }
    const options: any = {
      page,
      limit,
    }

    if (request.query.sort) {
      try {
        options.sort = JSON.parse(`${request.query.sort}`)
      } catch (e) {
        console.log(e)
        // do nothing
      }
    }

    if (request.query.filter) {
      const filter = JSON.parse(request.query.filter as string)
      const newFilter = {}
      for (const k in filter) {
        if (filter[k]) {
          if (parseInt(filter[k])) {
            newFilter[k] = { $gte: filter[k] }
          } else {
            newFilter[k] = { $regex: new RegExp(filter[k], 'i') }
          }
        }
      }
      Object.assign(query, newFilter)
    }

    try {
      // @ts-ignore
      const cash = await this.cash.paginate(query, options)
      response.status(200)
      response.send(cash)
    } catch (error) {
      next(new HttpException(500, error.message))
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
    console.log(request.params)
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
    await this.cash
      .findOneAndDelete({ id })
      .then((successResponse) => {
        if (successResponse) {
          response.status(200)
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
