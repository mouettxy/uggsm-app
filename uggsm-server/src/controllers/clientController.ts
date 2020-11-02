import { api } from './../server'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IClientController } from '../interfaces'
import { ClientModel } from '../models'
import { ControllerMethod } from '../interfaces/controller'

export class ClientController implements IClientController {
  private model = ClientModel

  public getAll: ControllerMethod = async (req, res, next) => {
    try {
      const response = await this.model.find()

      if (response) {
        res.status(200)
        res.send(response)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, ''))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getPaginated: ControllerMethod = async (req, res, next) => {
    const { query, options } = parsePaginateResponse(req.query, false, this.model)

    try {
      // @ts-ignore
      const clients = await this.model.paginate(query, options)
      res.status(200)
      res.send(clients)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getByName: ControllerMethod = async (req, res, next) => {
    const name = req.params.name

    try {
      const response = await this.model.findOne({ name })

      if (response) {
        res.status(200)
        res.send(response)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, name))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getById: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
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

  public getByCode: ControllerMethod = async (req, res, next) => {
    const code = req.params.code

    try {
      const response = await this.model.findOne({ code })

      if (response) {
        res.status(200)
        res.send(response)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, code))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public create: ControllerMethod = async (req, res, next) => {
    try {
      const client = new this.model({
        ...req.body,
      })

      const response = await client.save()

      if (response) {
        res.status(200)
        api.io.emit('created client', response)
        api.io.emit('update clients')
      } else {
        next(new ObjectNotFoundException(this.model.modelName, ''))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public updateById: ControllerMethod = async (req, res, next) => {
    const id = req.params.id

    try {
      const response = await this.model.findOneAndUpdate({ id }, req.body, { new: true })

      if (response) {
        res.status(200)
        api.io.emit('updated client', response)
        api.io.emit('update clients')
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
      const response = await this.model.findOneAndDelete({ id })

      if (response) {
        api.io.emit('deleted client', id, response)
        api.io.emit('update clients')
        res.status(200)
        res.send(id)
      } else {
        next(new ObjectNotFoundException(this.model.modelName, id))
      }
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }
}
