import { HttpException } from './HttpException'

export class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Нет доступа к ресурсу или токен авторизации просрочен')
  }
}
