import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface IAuthentificationController {
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>
  logout: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
