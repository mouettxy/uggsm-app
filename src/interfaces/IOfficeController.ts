import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface IOfficeController {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getByCode: (req: Request, res: Response, next: NextFunction) => Promise<void>
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
