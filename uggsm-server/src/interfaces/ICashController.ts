import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface ICashController {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getAllByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  createByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
