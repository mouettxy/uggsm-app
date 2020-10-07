import { NextFunction } from 'connect'
import express from 'express'
import { AdversitementModel } from '../models'
import { ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IAdversitementController } from '../interfaces'

export class AdversitementController implements IAdversitementController {
  private adversitement = AdversitementModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.adversitement
      .find()
      .then((adversitement) => {
        response.status(200)
        response.send(adversitement)
      })
      .catch((err: Error) => {
        next(new HttpException(500, err.message))
      })
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.adversitement
      .findOne({ id })
      .then((adversitement) => {
        if (adversitement) {
          response.status(200)
          response.send(adversitement)
        } else {
          next(new ObjectNotFoundException(this.adversitement.modelName, id))
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
    const adversitementData = request.body
    try {
      const adversitement = new this.adversitement({
        ...adversitementData,
      })

      const saved = await adversitement.save()

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
    const adversitementData = request.body
    await this.adversitement
      .findOneAndUpdate({ id }, adversitementData, {
        new: true,
      })
      .then((updatedadversitement) => {
        if (updatedadversitement) {
          response.status(200)
          response.send(updatedadversitement)
        } else {
          next(new ObjectNotFoundException(this.adversitement.modelName, id))
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
    await this.adversitement
      .findOneAndDelete({ id })
      .then((successResponse) => {
        if (successResponse) {
          response.status(200)
          response.json({
            message: `Запись из кассы с ${id} была успешно удалена`,
          })
          response.send()
        } else {
          next(new ObjectNotFoundException(this.adversitement.modelName, id))
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
