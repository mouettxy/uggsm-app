import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface IOrdersController {
  getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getAllByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  addCompletedWork: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteCompletedWork: (req: Request, res: Response, next: NextFunction) => Promise<void>
  addSms: (req: Request, res: Response, next: NextFunction) => Promise<void>
  generateReport: (req: Request, res: Response, next: NextFunction) => Promise<void>
  getAllWithParams: (req: Request, res: Response, next: NextFunction) => Promise<void>
  addMasterComment: (req: Request, res: Response, next: NextFunction) => Promise<void>
  addManagerComment: (req: Request, res: Response, next: NextFunction) => Promise<void>
  addWorkflow: (req: Request, res: Response, next: NextFunction) => Promise<void>
  setStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>
  setPayed: (req: Request, res: Response, next: NextFunction) => Promise<void>
  setMaster: (req: Request, res: Response, next: NextFunction) => Promise<void>
  setManager: (req: Request, res: Response, next: NextFunction) => Promise<void>
  setOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  createByOffice: (req: Request, res: Response, next: NextFunction) => Promise<void>
  updateById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
