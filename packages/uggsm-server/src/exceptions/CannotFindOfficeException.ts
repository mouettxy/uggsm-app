import { HttpException } from '.'

export class CannotFindOfficeException extends HttpException {
  constructor(officeCode: string) {
    super(400, `Не удалось найти офис с кодом ${officeCode}`)
  }
}
