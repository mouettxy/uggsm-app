import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface ICashController {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getAllByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getPaginated: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getPaginatedNew: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getBalance: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getByOrder: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getTotalByFilter: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  createByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
