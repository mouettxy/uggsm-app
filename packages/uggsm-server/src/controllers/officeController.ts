import { api } from '../server'
import { NextFunction } from 'connect'
import express from 'express'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IOfficeController } from '../interfaces'
import { OfficeModel } from '../models'
import { BaseController } from '../base/Controller'

export class OfficeController extends BaseController implements IOfficeController {
  private model = OfficeModel

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
      .findOne({ code: code })
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
    const officeData = request.body

    const createdOffice = new this.model({
      ...officeData,
    })
    await createdOffice
      .save()
      .then((savedOrder) => {
        response.status(200)
        api.io.emit('created office', savedOrder)
        api.io.emit('update offices')
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
    const officeData = request.body
    await this.model
      .findByIdAndUpdate(id, officeData, {
        new: true,
      })
      .then((updatedOrder) => {
        if (updatedOrder) {
          response.status(200)
          api.io.emit('updated office', updatedOrder)
          api.io.emit('update offices')
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
          api.io.emit('deleted office', id)
          api.io.emit('update offices')
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
