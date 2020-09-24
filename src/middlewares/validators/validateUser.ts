import { RequestHandlerParams } from 'express-serve-static-core'
import { requiredFieldsHelper, badRequestHelper } from '../../utils/helpers'

export const user: RequestHandlerParams = [
  ...requiredFieldsHelper('username', 'password', 'credentials', 'office', 'role'),
  badRequestHelper(),
]
