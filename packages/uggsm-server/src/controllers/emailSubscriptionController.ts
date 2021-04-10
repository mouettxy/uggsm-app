import { ControllerMethod } from '../interfaces/controller'
import { HttpException } from '../exceptions'
import { BaseController } from '../base/Controller'
import { IEmailSubscriptionController } from '../interfaces'
import { EmailSubcriptionModel } from '../models'
import { api } from '../server'

export class EmailSubscriptionController extends BaseController implements IEmailSubscriptionController {
  private model = EmailSubcriptionModel

  public getAll: ControllerMethod = async (req, res, next) => {
    try {
      const data = await this.model.find()

      res.status(200)
      res.send(data)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    const request = req.body

    try {
      let data = new this.model({
        ...request,
      })

      data = await data.save()

      res.status(200)
      api.io.emit('created email subscription', data)
      api.io.emit('update email subscriptions')
      res.send(data)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public delete: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const isDeleted = await this.model.findByIdAndDelete(id)

      if (isDeleted) {
        res.status(200)
        api.io.emit('deleted email subscription', isDeleted)
        api.io.emit('update email subscriptions')
        res.send(isDeleted)
      } else {
        new HttpException(422, 'Не удалось удалить подписку.')
      }
    } catch (error) {
      next(new HttpException(500, error))
    }
  }
}
