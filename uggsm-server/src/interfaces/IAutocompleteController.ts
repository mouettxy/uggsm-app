import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface IAutocompleteController {
  customerName: (req: Request, res: Response, next: NextFunction) => Promise<void>
  customerPhone: (req: Request, res: Response, next: NextFunction) => Promise<void>
  phoneBrand: (req: Request, res: Response, next: NextFunction) => Promise<void>
  phoneModel: (req: Request, res: Response, next: NextFunction) => Promise<void>
  declaredDefect: (req: Request, res: Response, next: NextFunction) => Promise<void>
  appearance: (req: Request, res: Response, next: NextFunction) => Promise<void>
  kit: (req: Request, res: Response, next: NextFunction) => Promise<void>
  master: (req: Request, res: Response, next: NextFunction) => Promise<void>
  manager: (req: Request, res: Response, next: NextFunction) => Promise<void>
  completedWork: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
