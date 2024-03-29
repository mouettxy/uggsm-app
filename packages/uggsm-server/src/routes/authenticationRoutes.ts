import { IAuthentificationController } from '../interfaces'
import { AuthenticationController } from '../controllers'
import Router, { AUTH_MIDDLEWARE } from '../base/Router'
import * as userLoginValidator from '../middlewares/validators/validateUserLogin'
import * as userValidator from '../middlewares/validators/validateUser'

export class AuthenticationRouter extends Router<IAuthentificationController> {
  constructor() {
    super(AuthenticationController, '/auth', AUTH_MIDDLEWARE.DISABLE)
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
        method: 'post',
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
