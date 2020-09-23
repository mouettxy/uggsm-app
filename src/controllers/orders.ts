import { NextFunction } from 'connect'
import express from 'express'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOrdersController } from '../interfaces'
import { OfficeModel, OrderModel } from '../models'

export class OrdersController implements IOrdersController {
  private order = OrderModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.order
      .find({})
      .then(orders => {
        response.status(200)
        response.send(orders)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getAllByOffice = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const code = request.params.code
    await this.order
      .find()
      .populate({
        path: 'office',
        match: {
          code,
        },
      })
      .then(orders => {
        response.status(200)
        orders = orders.filter(function(order) {
          return order.office
        })
        response.send(orders)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.order
      .findOne({ id })
      .then(order => {
        if (order) {
          response.status(200)
          response.send(order)
        } else {
          next(new ObjectNotFoundException(this.order.modelName, id))
        }
      })
      .catch(() =>
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.',
          ),
        ),
      )
  }

  public create = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const orderData = request.body

    const createdOrder = new this.order({
      ...orderData,
      orderCreationDate: new Date(),
    })
    await createdOrder
      .save()
      .then(savedOrder => {
        response.status(200)
        response.send(savedOrder)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public async addCompletedWork(
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const order = await OrderModel.addCompletedWork(request.params.id, request.body)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public async addSms(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderModel.addSmsMessage(request.params.id, request.body)

      // TODO: sms sending through gate
      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addMasterComment = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.addMasterComment(request.params.id, request.body)
      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addManagerComment = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.addManagerComment(request.params.id, request.body)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addWorkflow = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.addWorkflow(request.params.id, request.body)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setStatus = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.setStatus(request.params.id, request.body.status)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setPayed = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    try {
      const order = await OrderModel.setPayed(request.params.id, request.body.payed)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setMaster = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.setMaster(request.params.id, request.body.master)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setManager = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.setManager(request.params.id, request.body.manager)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setOffice = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await OrderModel.setOffice(request.params.id, request.body.office)

      if (order) {
        response.status(200)
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public createByOffice = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const orderData = request.body
    const officeCode = request.params.code

    try {
      const office = await OfficeModel.getOneByCode(officeCode)

      if (!office) {
        next(new CannotFindOfficeException(officeCode))
      }

      const order = new this.order({
        ...orderData,
        office: office._id,
      })

      const savedOrderFirstIteration = await order.save()

      // @ts-ignore
      savedOrderFirstIteration.setNext('order_id', async (_err, doc) => {
        const parsed = office.ordersTemplateParsed

        // setting up zero values so we can increment to it
        let initial = parsed[0] + String('0').repeat(parseInt(parsed[1]))

        // if incremented value bigger than zero amount we should extend
        // given template and extend amount of zeros to prevent id broke
        if (savedOrderFirstIteration.id.toString().length > initial.length - 1) {
          initial = parsed[0] + String('0').repeat(savedOrderFirstIteration.id.toString().length)
        }

        savedOrderFirstIteration.id = parseInt(initial) + savedOrderFirstIteration.id

        const savedOrderSecondIteration = await savedOrderFirstIteration.save()

        response.status(200)
        response.send(savedOrderSecondIteration)
      })
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id: string = request.params.id
    const orderData = request.body
    await this.order
      .findByIdAndUpdate(id, orderData, {
        new: true,
      })
      .then(updatedOrder => {
        if (updatedOrder) {
          response.status(200)
          response.send(updatedOrder)
        } else {
          next(new ObjectNotFoundException(this.order.modelName, id))
        }
      })
      .catch(() => {
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.',
          ),
        )
      })
  }

  public deleteById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction,
  ): Promise<void> => {
    const id = request.params.id
    await this.order
      .findByIdAndDelete(id)
      .then(successResponse => {
        if (successResponse) {
          response.status(200)
          response.json({
            message: `the order with id: ${id} was deleted successfully`,
          })
          response.send()
        } else {
          next(new ObjectNotFoundException(this.order.modelName, id))
        }
      })
      .catch(() => {
        next(
          new HttpException(
            422,
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.',
          ),
        )
      })
  }
}
