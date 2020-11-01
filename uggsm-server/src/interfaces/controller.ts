import { NextFunction } from 'connect'
import { Request, Response } from 'express'

export interface ControllerMethod {
  (req: Request, res: Response, next: NextFunction): Promise<void>
}
