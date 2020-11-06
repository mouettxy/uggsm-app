import { api } from '../server'
import bcrypt from 'bcrypt'
import { NextFunction } from 'connect'
import express from 'express'
import jwt from 'jsonwebtoken'
import { Document } from 'mongoose'
import {
  CannotFindOfficeException,
  HttpException,
  UserWithThatUsernameAlreadyExistsException,
  WrongCredentialsException,
} from '../exceptions'
import { IAuthentificationController, DataStoredInToken, TokenData } from '../interfaces'
import { OfficeModel, UserModel } from '../models'

export class AuthenticationController implements IAuthentificationController {
  private user = UserModel

  private static createAccessToken(user: Document): TokenData {
    const expiresIn = parseInt(process.env.ACCESS_TOKEN_LIFE)
    const secret = process.env.ACCESS_TOKEN_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user.get('_id'),
    }

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    }
  }

  private static createRefreshToken(user: Document): TokenData {
    const expiresIn = parseInt(process.env.REFRESH_TOKEN_LIFE)
    const secret = process.env.REFRESH_TOKEN_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user.get('_id'),
    }

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    }
  }

  public register = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
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

  public login = async (req: express.Request, res: express.Response, next: NextFunction): Promise<void> => {
    const loginData = req.body
    const user = await this.user.findOne({ username: loginData.username })
    if (user) {
      const matchedPassword = await bcrypt.compare(loginData.password, user.get('password'))

      if (matchedPassword) {
        const accessToken = AuthenticationController.createAccessToken(user)
        const refreshToken = AuthenticationController.createRefreshToken(user)
        user.tokens.push(refreshToken.token)
        await user.save()
        user.set('password', undefined)
        res.cookie('jwt', accessToken.token, { domain: '.uggsm.ru' })
        res.send(user)
      } else {
        next(new WrongCredentialsException())
      }
    } else {
      next(new WrongCredentialsException())
    }
  }

  public logout = async (request: express.Request, response: express.Response): Promise<void> => {
    response.status(200).send({ status: 200, message: 'logout successfully' })
  }
}
