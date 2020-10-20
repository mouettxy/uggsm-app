import { api } from './../server'
import { NextFunction } from 'connect'
import express from 'express'
import { parsePaginateResponse } from '../utils/helpers'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IClientController } from '../interfaces'
import { ClientModel } from '../models'

export class ClientController implements IClientController {
  private model = ClientModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.model
      .find({})
      .then((orders) => {
        response.status(200)
        response.send(orders)
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
    const { query, options } = parsePaginateResponse(request.query, false, this.model)
    try {
      // @ts-ignore
      const clients = await this.model.paginate(query, options)
      response.status(200)
      response.send(clients)
    } catch (error) {
      next(new HttpException(500, error.message))
    }
  }

  public getByName = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const name = request.params.name
    await this.model
      .findOne({ name })
      .then((user) => {
        response.status(200)
        response.send(user)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.model
      .findById(id)
      .then((order) => {
        if (order) {
          response.status(200)
          response.send(order)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
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

  public getByCode = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const code = request.params.code
    await this.model
      .find({ code: code })
      .then((order) => {
        if (order) {
          response.status(200)
          response.send(order)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, code))
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
    const clientData = request.body

    const createdClient = new this.model({
      ...clientData,
    })
    await createdClient
      .save()
      .then((savedOrder) => {
        response.status(200)
        api.io.emit('created client', savedOrder)
        api.io.emit('update clients')
        response.send(savedOrder)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public updateById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const id: string = request.params.id
    const clientData = request.body
    await this.model
      .findByIdAndUpdate(id, clientData, {
        new: true,
      })
      .then((updatedOrder) => {
        if (updatedOrder) {
          response.status(200)
          api.io.emit('updated client', updatedOrder)
          api.io.emit('update clients')
          response.send(updatedOrder)
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
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
    await this.model
      .findByIdAndDelete(id)
      .then((successResponse) => {
        if (successResponse) {
          response.status(200)
          api.io.emit('deleted client', id)
          api.io.emit('update clients')
          response.json({
            message: `Оффис с ${id} был успешно удалён`,
          })
          response.send()
        } else {
          next(new ObjectNotFoundException(this.model.modelName, id))
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
