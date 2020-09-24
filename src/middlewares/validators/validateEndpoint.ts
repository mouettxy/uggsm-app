import { Request, Response } from 'express'

export const endpoint = (request: Request, response: Response): void => {
  response.status(404).send({
    status: 404,
    message: `${request.method} на конечной точке ${request.url} не найден`,
  })
}
