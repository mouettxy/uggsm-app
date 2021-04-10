import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthTokenData } from '../interfaces'
import { UserModel } from '../models'
import { AccessService } from '../services'

const TOKEN_TYPE = 'Bearer'
const TOKEN_SECRET = process.env.JWT_TOKEN_SECRET

const Access = new AccessService()

export const collectAccessMiddleware = (resource, action) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    next()
    return
  }

  const rawToken = req.headers.authorization.split(' ')
  const token = {
    type: rawToken[0],
    value: rawToken[1],
  }

  if (!(token.type === TOKEN_TYPE && token.value)) {
    next()
    return
  }

  const jwtData = jwt.verify(token.value, TOKEN_SECRET) as AuthTokenData

  if (!jwtData) {
    next()
    return
  }

  const user = await UserModel.findById(jwtData._id)

  try {
    await Access.create({
      userId: user.id,
      userCredentials: user.credentials,
      time: new Date(),
      resource,
      action,
      //@ts-ignore
      userIp: req.clientIp,
      //@ts-ignore
      userOs: req.useragent.os,
      //@ts-ignore
      userBrowser: req.useragent.browser,
    })
  } catch (error) {
    next()
    return
  }

  next()
}
