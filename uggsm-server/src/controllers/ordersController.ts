import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { generateOrderId, parsePaginateResponse } from '../utils/helpers'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOrdersController } from '../interfaces'
import { OfficeModel, OrderModel } from '../models'
import { filter, first } from 'lodash'

export class OrdersController implements IOrdersController {
  private order = OrderModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.order
      .find({})
      .then((orders) => {
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
    next: NextFunction
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
      .then((orders) => {
        response.status(200)
        orders = orders.filter(function (order) {
          return order.office
        })
        response.send(orders)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getAllWithParams = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const { query, options } = parsePaginateResponse(request.query, true, this.order)
    try {
      // @ts-ignore
      const orders = await this.order.paginate(query, options)
      response.status(200)
      response.send(orders)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.order
      .findOne({ id })
      .then((order) => {
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
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
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
      .then((savedOrder) => {
        response.status(200)
        api.io.emit('created order', savedOrder)
        response.send(savedOrder)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public async addCompletedWork(
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await OrderModel.addCompletedWork(request.params.id, request.body)

      if (order) {
        response.status(200)
        api.io.emit('added order completed work', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        response.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public async deleteCompletedWork(
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const order = await OrderModel.findOne({ id: request.params.id })

      const completedWorks = filter(order.statusWork, (e) => e.id != parseInt(request.params.workId))

      order.statusWork = completedWorks

      await order.save()

      if (order) {
        response.status(200)
        api.io.emit('deleted order completed work', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
        api.io.emit('added order sms', order.id)
        api.io.emit('update order', order.id)
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.addMasterComment(request.params.id, request.body)
      if (order) {
        response.status(200)
        api.io.emit('added order masterComment', order.id)
        api.io.emit('update order', order.id)
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.addManagerComment(request.params.id, request.body)

      if (order) {
        response.status(200)
        api.io.emit('added order manager comment', order.id)
        api.io.emit('update order', order.id)
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.addWorkflow(request.params.id, request.body)

      if (order) {
        response.status(200)
        api.io.emit('added order workflow', order.id)
        api.io.emit('update order', order.id)
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.setStatus(request.params.id, request.body.status, request.body.userid)

      if (order) {
        response.status(200)
        api.io.emit('added order status', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
      const order = await OrderModel.setPayed(request.params.id, request.body.payed, request.body.userid)

      if (order) {
        response.status(200)
        api.io.emit('added order payed', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.setMaster(request.params.id, request.body.master, request.body.userid)

      if (order) {
        response.status(200)
        api.io.emit('added order master', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.setManager(request.params.id, request.body.manager, request.body.userid)

      if (order) {
        response.status(200)
        api.io.emit('added order manager', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
    next: NextFunction
  ): Promise<void> => {
    try {
      const order = await OrderModel.setOffice(request.params.id, request.body.office, request.body.userid)

      if (order) {
        response.status(200)
        api.io.emit('added order office', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
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
    next: NextFunction
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

      const firstIteration = await order.save()

      // @ts-ignore
      firstIteration.setNext('order_id', async (_err, doc) => {
        const id = generateOrderId(office.ordersTemplateParsed, firstIteration.id)
        firstIteration.id = id

        const secondIteration = await firstIteration.save()

        response.status(200)
        api.io.emit('created order', secondIteration)
        api.io.emit('update orders')
        response.send(secondIteration)
      })
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public generateReport = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const params = request.query as { firstDate: string; secondDate: string; office: string; status: string }

    try {
      const aggregated = await this.order.aggregate([
        {
          $lookup: {
            from: 'offices',
            localField: 'office',
            foreignField: '_id',
            as: 'office',
          },
        },
        {
          $unwind: {
            path: '$office',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'master',
            foreignField: '_id',
            as: 'master',
          },
        },
        {
          $unwind: {
            path: '$master',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'manager',
            foreignField: '_id',
            as: 'manager',
          },
        },
        {
          $unwind: {
            path: '$manager',
          },
        },
        {
          $lookup: {
            from: 'cashes',
            localField: 'id',
            foreignField: 'orderid',
            as: 'cash',
          },
        },
        {
          $match: {
            status: params.status,
            'office.code': params.office,
            closedAt: {
              $gte: new Date(params.firstDate),
              $lt: new Date(params.secondDate),
            },
          },
        },
        {
          $unwind: {
            path: '$statusWork',
          },
        },
        {
          $addFields: {
            idString: {
              $toString: '$id',
            },
            statusWork: {
              priceString: {
                $toString: '$statusWork.price',
              },
            },
          },
        },
        {
          $project: {
            master: '$statusWork.credentials',
            manager: '$manager.credentials',
            date: '$closedAT',
            type: 'Исполнителю за работу в заказе',
            product: {
              $concat: ['Заказ №', '$idString', ' ', '$phoneModel', ' (', '$serialNumber', ') '],
            },
            works: {
              work: { $concat: ['$statusWork.header', ' (', '$statusWork.message', ') '] },
              total: '$statusWork.price',
            },
            price: '$statusWork.price',
            total: '$statusWork.price',
          },
        },
        {
          $group: {
            _id: {
              master: '$master',
              type: '$type',
              product: '$product',
            },
            works: {
              $push: '$works',
            },
            price: {
              $sum: '$price',
            },
            total: {
              $sum: '$total',
            },
          },
        },
        {
          $project: {
            _id: 0,
            master: '$_id.master',
            type: '$_id.type',
            product: '$_id.product',
            works: 1,
            price: 1,
            total: 1,
          },
        },
      ])

      response.status(200)
      response.send(aggregated)
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const id: string = request.params.id
    const orderData = request.body

    const order = await this.order.findById(id)
    // @ts-ignore
    const oldMaster = order.master ? order.master._id : ''
    // @ts-ignore
    const oldManager = order.manager ? order.manager._id : ''

    if (oldMaster.toString() !== orderData.master) {
      const newMaster = orderData.master

      await this.order.setMaster(order.id, newMaster, orderData.userid)
    }
    if (oldManager.toString() !== orderData.manager) {
      const newManager = orderData.manager

      await this.order.setManager(order.id, newManager, orderData.userid)
    }

    delete orderData.master
    delete orderData.manager

    await this.order
      .findByIdAndUpdate(id, orderData, {
        new: true,
      })
      .then((updatedOrder) => {
        if (updatedOrder) {
          response.status(200)
          api.io.emit('updated order', updatedOrder)
          api.io.emit('update orders')
          response.send(updatedOrder)
        } else {
          next(new ObjectNotFoundException(this.order.modelName, id))
        }
      })
      .catch((err) => {
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
    await this.order
      .findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.status(200)
          api.io.emit('deleted order', id)
          api.io.emit('update orders')
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
            'Unprocessable entity. The request was well-formed but was unable to be followed due to semantic errors.'
          )
        )
      })
  }
}
