import { api } from './../server'
import { generateOrderId, parsePaginateResponse } from '../utils/helpers'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOrdersController } from '../interfaces'
import { OfficeModel, OrderModel } from '../models'
import { filter } from 'lodash'
import generateReport from '../services/reports'
import { ControllerMethod } from 'src/interfaces/controller'

export class OrdersController implements IOrdersController {
  private model = OrderModel
  private socket = api.io

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
      this.socket.emit('created order', response)
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
        this.socket.emit('added order completed work', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
        this.socket.emit('deleted order completed work', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public addSms: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addSmsMessage(req.params.id, req.body)

      // TODO: sms sending through gate
      if (order) {
        res.status(200)
        this.socket.emit('added order sms', order.id)
        this.socket.emit('update order', order.id)
        res.send(order)
      } else {
        throw new Error('Не удалось обработать данные')
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
        this.socket.emit('added order masterComment', order.id)
        this.socket.emit('update order', order.id)
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
        this.socket.emit('added order manager comment', order.id)
        this.socket.emit('update order', order.id)
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
        this.socket.emit('added order workflow', order.id)
        this.socket.emit('update order', order.id)
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
        this.socket.emit('added order status', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
        this.socket.emit('added order payed', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
        this.socket.emit('added order master', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
        this.socket.emit('added order manager', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
        this.socket.emit('added order office', order.id)
        this.socket.emit('update order', order.id)
        this.socket.emit('update orders')
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
          this.socket.emit('created order', saved)
          this.socket.emit('update orders')
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
        this.socket.emit('updated order', response)
        this.socket.emit('update orders')
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
        this.socket.emit('deleted order', id)
        this.socket.emit('update orders')
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
