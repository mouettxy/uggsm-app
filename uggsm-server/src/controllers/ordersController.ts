import { MessageInput, MessageItem } from './../services/sms/RedSmsClient'
import { api } from './../server'
import { generateOrderId, parsePaginateResponse } from '../utils/helpers'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOrdersController } from '../interfaces'
import { OfficeModel, OrderModel } from '../models'
import { filter, map, join, each } from 'lodash'
import generateReport from '../services/reports'
import { ControllerMethod } from '../interfaces/controller'
import { RedSmsClient } from '../services/sms/RedSmsClient'

export class OrdersController implements IOrdersController {
  private model = OrderModel
  private smsClient = new RedSmsClient()

  public getAll: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.model.find()

      res.status(200)
      res.send(response)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getAllByOffice: ControllerMethod = async (req, res, next) => {
    try {
      const code = req.params.code
      let response = await this.model.find().populate({
        path: 'office',
        match: {
          code,
        },
      })

      response = response.filter(function (order) {
        return order.office
      })

      res.status(200)
      res.send(response)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getAllWithParams: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginateResponse(req.query, true, this.model)
      // @ts-ignore
      const response = await this.model.paginate(query, options)

      res.status(200)
      res.send(response)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getById: ControllerMethod = async (req, res, next) => {
    try {
      const id = req.params.id
      const response = await this.model.findOne({ id })

      if (response) {
        res.status(200)
        res.send(response)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    try {
      let response = new this.model({
        ...req.body,
      })

      response = await response.save()

      res.status(200)
      api.io.emit('created order', response)
      res.send(response)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public addCompletedWork: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addCompletedWork(req.params.id, req.body)

      if (order) {
        res.status(200)
        api.io.emit('added order completed work', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public deleteCompletedWork: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.findOne({ id: req.params.id })

      const completedWorks = filter(order.statusWork, (e) => e.id != parseInt(req.params.workId))

      order.statusWork = completedWorks

      await order.save()

      if (order) {
        res.status(200)
        api.io.emit('deleted order completed work', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addSms: ControllerMethod = async (req, res, next) => {
    const type: 'order-created' | 'order-closed' | 'order-closed-without-work' | 'message' = req.body.type
    const id = req.params.id
    const model = req.body.model
    const price = req.body.price
    const phone = req.body.phone
    const from = 'top-service'
    delete req.body.type

    let message: MessageInput
    if (type === 'order-created') {
      message = {
        from,
        to: phone,
        text: `Заказ на ремонт №${id} (${model}) создан`,
      }
    } else if (type === 'order-closed') {
      message = {
        from,
        to: phone,
        text: `Заказ №${id} (${model}) Готов! К оплате ${price} руб.`,
      }
    } else if (type === 'order-closed-without-work') {
      message = {
        from,
        to: phone,
        text: `Заказ №${id} (${model}) Готов без ремонта! ${price} руб.`,
      }
    } else {
      message = {
        from,
        to: phone,
        text: req.body.message,
      }
    }

    try {
      const sms = await this.smsClient.sendSms(message)

      if (sms.success) {
        const uuid = sms.items[0].uuid

        const order = await this.model.addSmsMessage(id, {
          message: message.text,
          uuid,
        })

        if (order) {
          res.status(200)
          api.io.emit('added order sms', order.id)
          api.io.emit('update order', order.id)
          res.send(order)
        }
      } else {
        next(
          new HttpException(
            500,
            join(
              map(sms.errors, (e) => e.message),
              ', '
            )
          )
        )
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public smsCallback: ControllerMethod = async (req, res, next) => {
    try {
      const message: MessageItem = req.body

      console.log(message)

      let order = await this.model.findOne({
        statusSms: {
          $elemMatch: {
            uuid: message.uuid,
          },
        },
      })

      console.log(order)

      order.statusSms = map(order.statusSms, (e) => {
        if (e.uuid === message.uuid) {
          return {
            ...e,
            sended: true,
          }
        }
      })

      order = await order.save()

      if (order) {
        res.status(200)
        api.io.emit('verified order sms', message, order.id)
        api.io.emit('update order', order.id)
        res.send(order)
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addMasterComment: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addMasterComment(req.params.id, req.body)
      if (order) {
        res.status(200)
        api.io.emit('added order masterComment', order.id)
        api.io.emit('update order', order.id)
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addManagerComment: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addManagerComment(req.params.id, req.body)

      if (order) {
        res.status(200)
        api.io.emit('added order manager comment', order.id)
        api.io.emit('update order', order.id)
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addWorkflow: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addWorkflow(req.params.id, req.body)

      if (order) {
        res.status(200)
        api.io.emit('added order workflow', order.id)
        api.io.emit('update order', order.id)
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setStatus: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setStatus(req.params.id, req.body.status, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order status', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setPayed: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setPayed(req.params.id, req.body.payed, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order payed', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setMaster: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setMaster(req.params.id, req.body.master, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order master', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setManager: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setManager(req.params.id, req.body.manager, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order manager', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setOffice: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setOffice(req.params.id, req.body.office, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order office', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public createByOffice: ControllerMethod = async (req, res, next) => {
    const orderData = req.body
    const officeCode = req.params.code

    try {
      const office = await OfficeModel.getOneByCode(officeCode)

      if (!office) {
        next(new CannotFindOfficeException(officeCode))
      }

      const order = new this.model({
        ...orderData,
        office: office._id,
      })

      let saved = await order.save()

      if (saved) {
        // @ts-ignore
        saved.setNext('order_id', async (_err, doc) => {
          const id = generateOrderId(office.ordersTemplateParsed, doc.id)
          doc.id = id

          saved = await doc.save()

          res.status(200)
          api.io.emit('created order', saved)
          api.io.emit('update orders')
          res.send(saved)
        })
      } else {
        next(new HttpException(500, 'Ошибка валидации полей.'))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public generateReport: ControllerMethod = async (req, res, next) => {
    const params = req.query as { date: string | string[]; office: string; status: string; type: string }

    try {
      const aggregated = await generateReport(params, this.model)

      res.status(200)
      res.send(aggregated)
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public updateById: ControllerMethod = async (req, res, next) => {
    const id: string = req.params.id
    const orderData = req.body

    const order = await this.model.findById(id)
    // @ts-ignore
    const oldMaster = order.master ? order.master._id : ''
    // @ts-ignore
    const oldManager = order.manager ? order.manager._id : ''

    if (oldMaster.toString() !== orderData.master) {
      const newMaster = orderData.master

      await this.model.setMaster(order.id, newMaster, orderData.userid)
    }
    if (oldManager.toString() !== orderData.manager) {
      const newManager = orderData.manager

      await this.model.setManager(order.id, newManager, orderData.userid)
    }

    delete orderData.master
    delete orderData.manager

    try {
      const response = await this.model.findByIdAndUpdate(id, req.body, { new: true })

      if (response) {
        res.status(200)
        api.io.emit('updated order', response)
        api.io.emit('update orders')
        res.send(response)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public deleteById: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const response = await this.model.findByIdAndDelete(id)

      if (response) {
        res.status(200)
        api.io.emit('deleted order', id)
        api.io.emit('update orders')
        res.json({
          message: `the order with id: ${id} was deleted successfully`,
        })
        res.send()
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }
}
