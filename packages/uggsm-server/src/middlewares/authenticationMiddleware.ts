import { Response, Request } from 'express'
import { NextFunction } from 'connect'
import jwt from 'jsonwebtoken'
import { AuthTokenData } from 'src/interfaces'
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../exceptions'
import { UserModel } from '../models'

export async function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const tokenData = request.headers.authorization.split(' ')
  const tokenType = tokenData[0]
  const token = tokenData[1]
  if (tokenType === 'Bearer' && token) {
    const secret = process.env.JWT_TOKEN_SECRET
    try {
      const verificationResponse = jwt.verify(token, secret) as AuthTokenData
      const id = verificationResponse._id
      const user = await UserModel.findById(id)
      if (user) {
        next()
      } else {
        next(new WrongAuthenticationTokenException())
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException())
    }
  } else {
    next(new AuthenticationTokenMissingException())
  }
}
