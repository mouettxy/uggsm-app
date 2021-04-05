import { parsePaginationQuery } from './../services/pagination'
import { BaseController } from './base/BaseController'
import { MessageInput } from '../services/sms/RedSmsClient'
import { api } from '../server'
import { generateOrderId } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOrdersController } from '../interfaces'
import { CashModel, OfficeModel, OrderModel } from '../models'
import { filter, map, join, reduce } from 'lodash'
import generateReport from '../services/reports'
import { ControllerMethod } from '../interfaces/controller'
import { RedSmsClient } from '../services/sms/RedSmsClient'

export class OrdersController extends BaseController implements IOrdersController {
  private model = OrderModel

  private smsClient = new RedSmsClient()

  private disableSmsClient = process.env.NODE_ENV !== 'production'

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

  public getPaginated: ControllerMethod = async (req, res, next) => {
    try {
      const { query, options } = parsePaginationQuery(req.body, this.model, (query) => {
        return {
          ...query,
          office: req.body.office,
        }
      })

      // @ts-ignore
      const response = await this.model.paginate(query, options)

      this.success(res, response)
    } catch (error) {
      this.criticalError(next, error.message)
    }
  }

  public getById: ControllerMethod = async (req, res, next) => {
    try {
      const id = req.params.id
      let response = await this.model.findOne({ id })

      if (response) {
        response = response.toObject()

        const cash = await CashModel.find({ orderid: parseInt(id) })

        //@ts-ignore
        response.cash = cash

        res.status(200)
        res.send(response)
      } else {
        next(new HttpException(400, `Заказ с ID №${id} не найден`))
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

  public addUsedDetail: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.addUsedDetail(req.params.id, req.body)

      if (order) {
        api.io.emit('update order', order.id)
        api.io.emit('update orders')
        this.success(res, order)
        return
      }

      this.badRequest(next, 'Не удалось обработать данные')
    } catch (e) {
      console.log(e)
      this.criticalError(next, e.message)
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
    const model = req.body.model
    const price = req.body.price
    const phone = req.body.phone
    const from = 'top-service'
    const id = req.params.id as string

    const alternateId = req.body.alternateId || ''

    //!FIXME WTF ?
    delete req.body.type

    let message: MessageInput
    if (type === 'order-created') {
      message = {
        from,
        to: phone,
        text: `Заказ на ремонт №${alternateId || id} (${model}) создан`,
      }
    } else if (type === 'order-closed') {
      message = {
        from,
        to: phone,
        text: `Заказ №${alternateId || id} (${model}) Готов! К оплате ${price} руб.`,
      }
    } else if (type === 'order-closed-without-work') {
      message = {
        from,
        to: phone,
        text: `Заказ №${alternateId || id} (${model}) Готов без ремонта! ${price} руб.`,
      }
    } else {
      message = {
        from,
        to: phone,
        text: req.body.message,
      }
    }

    if (!this.disableSmsClient) {
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
    } else {
      res.status(200)
      res.send({
        type,
        model,
        price,
        phone,
        from,
        id,
        alternateId,
        message,
      })
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
    function getCashPrepay(order) {
      let skipCash = false
      let income = reduce(
        order.statusWork,
        (a, e) => {
          a += e.price
          return a
        },
        0
      )

      const cash = order.cash

      let consumption
      if (cash.length > 0) {
        const prepaySum = reduce(
          cash,
          (a, e) => {
            a += e.income
            return a
          },
          0
        )

        const difference = income - prepaySum

        if (income === 0 && prepaySum > 0) {
          consumption = prepaySum
        } else if (prepaySum > income && difference > 0) {
          income = difference
        } else if (difference < 0) {
          consumption = difference
        } else if (prepaySum === income) {
          skipCash = true
        }

        return {
          income,
          consumption,
          skipCash,
          difference,
        }
      }

      return {
        income,
        consumption,
        skipCash,
        difference: income,
      }
    }

    const id = req.params.id
    const status = req.body.status
    const userId = req.body.userid
    const userMongoId = req.body.userMongoId
    const officeId = req.body.officeId

    let response: any = {
      status: 'OK',
      sms: false,
    }

    try {
      if (['Готов', 'Готов, без ремонта', 'Закрыт'].includes(status)) {
        let order = await this.model.findOne({ id })

        if (order) {
          order = order.toObject()
          const cash = await CashModel.find({ orderid: parseInt(id) })

          // @ts-ignore
          order.cash = cash

          const { consumption, skipCash, difference } = getCashPrepay(order)

          if (status === 'Закрыт') {
            const cashPayload: any = {
              orderid: order.id,
              //@ts-ignore
              client: order.customer._id,
              cashier: userMongoId,
              office: officeId,
            }

            if (!skipCash) {
              if (consumption) {
                cashPayload.consumption = Math.abs(consumption)
              } else {
                cashPayload.income = difference
              }

              const cash = new CashModel(cashPayload)

              await cash.save()
            }

            await this.model.setPayed(id, true, userId)
          } else if (status === 'Готов') {
            //@ts-ignore
            if (order.customer && order.customer.phone.length && order.customer.phone[0].phone) {
              response = {
                status: 'OK',
                sms: true,
                smsType: 'order-closed',
                smsPayload: {
                  id,
                  //@ts-ignore
                  phone: '8' + order.customer.phone[0].phone,
                  model: `${order.phoneBrand} ${order.phoneModel}`,
                  price: difference || 0,
                },
              }
            } else {
              response = {
                status: 'OK',
                sms: false,
              }
            }
          } else if (status === 'Готов, без ремонта') {
            //@ts-ignore
            if (order.customer && order.customer.phone.length && order.customer.phone[0].phone) {
              response = {
                status: 'OK',
                sms: true,
                smsType: 'order-closed-without-work',
                smsPayload: {
                  id,
                  //@ts-ignore
                  phone: '8' + order.customer.phone[0].phone,
                  model: `${order.phoneBrand} ${order.phoneModel}`,
                  price: reduce(
                    order.statusWork,
                    (a, e) => {
                      a += e.price
                      return a
                    },
                    0
                  ),
                },
              }
            } else {
              response = {
                status: 'OK',
                sms: false,
              }
            }
          }
        }
      }

      const order = await this.model.setStatus(id, status, userId)

      if (order) {
        res.status(200)
        api.io.emit('added order status', order.id)
        api.io.emit('update order', order.id)
        api.io.emit('update orders')

        res.send(response)
      } else {
        throw new Error('Не удалось обработать данные')
      }
    } catch (e) {
      next(new HttpException(500, e.message))
    }
  }

  public setEstimatedCloseAt: ControllerMethod = async (req, res, next) => {
    try {
      const order = await this.model.setEstimatedCloseAt(req.params.id, req.body.time, req.body.userid)

      if (order) {
        res.status(200)
        api.io.emit('added order estimated close time', order.id)
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
    if (req.body.duplicate) {
      try {
        const order = await this.model.findOne({ id: req.params.id })

        const orderObj = order.toObject()

        delete orderObj._id
        delete orderObj.id

        orderObj.customer = orderObj.customer._id
        orderObj.manager = orderObj.manager._id
        orderObj.master = orderObj.master._id
        orderObj.office = orderObj.office._id

        try {
          const created: any = await this._createOrderHelper(orderObj, order.officeCode)

          await this.model.setOffice(created.data.id, req.body.office, req.body.userid)

          res.status(200)
          api.io.emit('duplicated order', created.data.id)
          api.io.emit('added order office', created.data.id)
          api.io.emit('update order', created.data.id)
          api.io.emit('update orders')
          res.send(created.data)
        } catch (error) {
          next(new HttpException(500, error.data))
        }
      } catch (error) {
        next(new HttpException(500, error.message))
      }
    } else {
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
  }

  private _createOrderHelper(orderData: any, officeCode: any) {
    return new Promise((resolve, reject) => {
      try {
        OfficeModel.getOneByCode(officeCode).then((office) => {
          if (!office) {
            reject({
              status: 'ERROR',
              data: 'Не удалось найти офис',
            })
          } else {
            const order = new this.model({
              ...orderData,
              office: office._id,
            })

            order.save().then((saved) => {
              if (saved) {
                // @ts-ignore
                saved.setNext('order_id', (_err, doc) => {
                  if (_err) {
                    saved.remove().then(() => {
                      reject({
                        status: 'ERROR',
                        data: 'Ошибка сервера',
                      })
                    })
                  } else {
                    if (office.ordersTemplateParsed && typeof office.ordersTemplateParsed !== 'boolean') {
                      const id = generateOrderId(office.ordersTemplateParsed, doc.id)
                      doc.id = id

                      doc.save().then((saved) => {
                        resolve({
                          status: 'OK',
                          data: saved,
                        })
                      })
                    } else {
                      saved.remove().then(() => {
                        reject({
                          status: 'ERROR',
                          data: 'Некорректный шаблон номера заказа в настройках офиса',
                        })
                      })
                    }
                  }
                })
              } else {
                reject({
                  status: 'ERROR',
                  data: 'Некорректный шаблон номера заказа в настройках офиса',
                })
              }
            })
          }
        })
      } catch (error) {
        reject({
          status: 'ERROR',
          data: error.message,
        })
      }
    })
  }

  public createByOffice: ControllerMethod = async (req, res, next) => {
    const orderData = req.body
    const officeCode = req.params.code

    try {
      const created: any = await this._createOrderHelper(orderData, officeCode)

      res.status(200)
      api.io.emit('created order', created.data)
      api.io.emit('update orders')
      res.send(created.data)
    } catch (error) {
      next(new HttpException(500, error.data))
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

    if (oldMaster.toString() !== orderData.master._id) {
      const newMaster = orderData.master._id

      await this.model.setMaster(order.id, newMaster, orderData.userid)
    }
    if (oldManager.toString() !== orderData.manager._id) {
      const newManager = orderData.manager._id

      await this.model.setManager(order.id, newManager, orderData.userid)
    }

    delete orderData.master
    delete orderData.manager
    delete orderData.workflow

    try {
      const response = await this.model.findByIdAndUpdate(id, orderData, { new: true })

      if (response) {
        res.status(200)
        api.io.emit('update order', response.id)
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
