import { NextFunction } from 'connect'
import express from 'express'
import { isString, reduce } from 'lodash'
import { HttpException } from '../exceptions'
import { IAutocompleteController } from '../interfaces'
import { ClientModel, OfficeModel, OrderModel, UserModel } from '../models'

export class AutocompleteController implements IAutocompleteController {
  private user = UserModel
  private order = OrderModel
  private office = OfficeModel
  private client = ClientModel

  public customerName = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.client
          .find({ name: new RegExp(search, 'i') })
          .select('name')
          .limit(10)
          .lean()

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e.name, value: e.name })
            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public customerPhone = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    const search = req.query.search

    if (isString(search)) {
      try {
        const response = await this.client.findOne({ name: search })
        const reduced = reduce(
          response.phone,
          (a, e) => {
            a.push({ text: e.phone, value: e.phone })
            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public phoneBrand = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order
          .aggregate([
            { $match: { phoneBrand: new RegExp(search, 'i') } },
            { $group: { _id: '$phoneBrand' } },
            { $sample: { size: 10 } },
          ])
          .limit(10)

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e._id, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public phoneModel = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order.aggregate([
          { $match: { phoneModel: new RegExp(search, 'i') } },
          { $group: { _id: '$phoneModel' } },
          { $sample: { size: 10 } },
        ])
        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e._id, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public declaredDefect = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order
          .aggregate([
            { $match: { declaredDefect: new RegExp(search, 'i') } },
            { $group: { _id: '$declaredDefect' } },
            { $sample: { size: 10 } },
          ])
          .limit(10)

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e._id, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public appearance = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order
          .aggregate([
            { $match: { appearance: new RegExp(search, 'i') } },
            { $group: { _id: '$appearance' } },
            { $sample: { size: 10 } },
          ])
          .limit(10)

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e._id, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public kit = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order
          .aggregate([
            { $match: { kit: new RegExp(search, 'i') } },
            { $group: { _id: '$kit' } },
            { $sample: { size: 10 } },
          ])
          .limit(10)

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e._id, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public completedWork = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.order.aggregate([
          { $unwind: '$statusWork' },
          { $match: { 'statusWork.header': new RegExp(search, 'i') } },
          {
            $group: {
              _id: { header: '$statusWork.header', price: '$statusWork.price', message: '$statusWork.message' },
            },
          },
          { $sample: { size: 10 } },
        ])

        const reduced = reduce(
          // @ts-ignore
          response,
          (a, e) => {
            a.push({ text: e._id.header, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public master = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.user
          .find({ credentials: new RegExp(search, 'i') })
          .select('_id credentials')
          .limit(10)
          .lean()

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e.credentials, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }

  public manager = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    let search = req.query.search

    if (!search) {
      search = ''
    }

    if (isString(search)) {
      try {
        const response = await this.user
          .find({ credentials: new RegExp(search, 'i') })
          .select('_id credentials')
          .limit(10)
          .lean()

        const reduced = reduce(
          response,
          (a, e) => {
            a.push({ text: e.credentials, value: e._id })

            return a
          },
          []
        )

        res.status(200)
        res.send(reduced)
      } catch (error) {
        next(new HttpException(500, 'Неопознанная ошибка при поиске'))
      }
    } else {
      next(new HttpException(400, 'Нет данных для поиска'))
    }
  }
}
