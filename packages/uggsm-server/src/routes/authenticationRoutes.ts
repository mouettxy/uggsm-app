import { IAuthentificationController } from '../interfaces'
import { AuthenticationController } from '../controllers'
import { ExtendedRouter } from './heplers/BaseRouter'
import * as userLoginValidator from '../middlewares/validators/validateUserLogin'
import * as userValidator from '../middlewares/validators/validateUser'

export class AuthenticationRouter extends ExtendedRouter<IAuthentificationController> {
  constructor() {
    super(AuthenticationController, '/auth', false)
  }

  defineRoutes() {
    this.addRoutes([
      {
        path: 'register',
        description: 'Зарегистрировать пользователя',
        controllerMethod: 'register',
        method: 'post',
        validators: [userValidator.user],
      },
      {
        path: 'login',
        description: 'Авторизовать пользователя',
        controllerMethod: 'login',
        method: 'get',
        validators: [userLoginValidator.userLogin],
      },
      {
        path: 'logout',
        description: 'Деавторизовать пользователя',
        controllerMethod: 'logout',
        method: 'post',
      },
    ])
  }
}
