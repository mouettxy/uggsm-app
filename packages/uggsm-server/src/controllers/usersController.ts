import bcrypt from 'bcrypt'
import { NextFunction } from 'connect'
import express from 'express'
import { api } from '../server'
import { CannotFindOfficeException, ObjectNotFoundException } from '../exceptions'
import { HttpException } from '../exceptions'
import { IUserController } from '../interfaces'
import { OfficeModel, UserModel } from '../models'

export class UsersController implements IUserController {
  private user = UserModel

  public getAll = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    await this.user
      .find()
      .populate('office')
      .then((users) => {
        response.status(200)
        response.send(users)
      })
      .catch((error: Error) => {
        next(new HttpException(500, error.message))
      })
  }

  public getById = async (request: express.Request, response: express.Response, next: NextFunction): Promise<void> => {
    const id = request.params.id
    await this.user
      .findById(id)
      .populate('office')
      .then((user) => {
        if (user) {
          response.status(200)
          response.send(user)
        } else {
          next(new ObjectNotFoundException(this.user.modelName, id))
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
    const userData = request.body
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const officeCode = userData.office

    try {
      const office = await OfficeModel.getOneByCode(officeCode)

      if (!office) {
        next(new CannotFindOfficeException(officeCode))
      }

      userData.office = office._id

      const user = new this.user({
        ...userData,
        password: hashedPassword,
      })

      const savedUser = await user.save()

      userData.password = undefined
      response.status(200)
      api.io.emit('created new user', savedUser.credentials)
      api.io.emit('update users')
      response.send(savedUser)
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
    const userData = request.body
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    // @ts-ignore
    await this.user.findOneAndUpdate(id, userData, { new: true }).then((user) => {
      if (user) {
        const updatedUser = {
          ...userData,
          password: hashedPassword,
        }
        response.status(200)
        api.io.emit('updated user', updatedUser)
        api.io.emit('update user', updatedUser.id)
        response.send(updatedUser)
      } else {
        next(new ObjectNotFoundException(this.user.modelName, id))
      }
    })
  }

  public deleteById = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ): Promise<void> => {
    const id = request.params.id
    await this.user.findByIdAndDelete(id).then((successResponse) => {
      if (successResponse) {
        response.status(200)
        api.io.emit('deleted user', id)
        api.io.emit('update users')
        api.io.emit('update user', id)
        response.json({
          message: `the user with id: ${id} was deleted successfully`,
        })
      } else {
        next(new ObjectNotFoundException(this.user.modelName, id))
      }
    })
  }
}
