import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface IClientController {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getPaginated: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getByName: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getByCode: (req: Request, res: Response, next: NextFunction) => Promise<void>
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
