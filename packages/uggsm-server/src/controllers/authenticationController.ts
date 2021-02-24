import { ControllerMethod } from './../interfaces/controller'
import { BaseController } from './base/BaseController'
import { api } from '../server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'
import {
  CannotFindOfficeException,
  HttpException,
  UserWithThatUsernameAlreadyExistsException,
  WrongCredentialsException,
} from '../exceptions'
import { IAuthentificationController, AuthToken, AuthTokenData } from '../interfaces'
import { OfficeModel, UserModel } from '../models'
import { filter, remove } from 'lodash'

export class AuthenticationController extends BaseController implements IAuthentificationController {
  private user = UserModel

  private static createToken(user: Document): AuthToken {
    const expiresIn = parseInt(process.env.JWT_TOKEN_LIFE)
    const secret = process.env.JWT_TOKEN_SECRET
    const dataStoredInToken: AuthTokenData = {
      _id: user.get('_id'),
      role: user.get('role'),
    }

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    }
  }

  public register: ControllerMethod = async (req, res, next) => {
    const userData = req.body
    if (await this.user.findOne({ username: userData.username })) {
      next(new UserWithThatUsernameAlreadyExistsException(userData.username))
    } else {
      try {
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const office = await OfficeModel.getOneByCode(userData.office)

        if (!office) {
          next(new CannotFindOfficeException(userData.office))
        }

        userData.office = office._id
        userData.password = hashedPassword

        const user = await this.user.create({
          ...userData,
        })

        user.set('password', undefined)

        api.io.emit('created new user', user.credentials)
        api.io.emit('update users')
        res.send(user)
      } catch (error) {
        next(new HttpException(500, error.message))
      }
    }
  }

  public login: ControllerMethod = async (req, res, next) => {
    const loginData = req.body
    const user = await this.user.findOne({ username: loginData.username })
    if (user) {
      const matchedPassword = await bcrypt.compare(loginData.password, user.get('password'))

      if (matchedPassword) {
        const jwtData = AuthenticationController.createToken(user)

        user.tokens.push(jwtData.token)

        await user.save()
        user.set('password', undefined)

        res.send({ user, jwtData })
      } else {
        next(new WrongCredentialsException())
      }
    } else {
      next(new WrongCredentialsException())
    }
  }

  public logout: ControllerMethod = async (req, res, next) => {
    const id: string = req.body.id
    const token: string = req.body.token

    try {
      const user = await this.user.findById(id)

      if (user) {
        if (!token) {
          user.tokens = []
        } else {
          remove(user.tokens, (e) => e === token)
        }

        await user.save()
      }

      res.status(200).send({ status: 200, message: 'OK' })
    } catch (error) {
      this.criticalError(next, 'ERROR')
    }
  }
}
