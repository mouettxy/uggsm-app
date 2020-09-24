import { RequestHandlerParams } from 'express-serve-static-core'
import { requiredFieldsHelper, badRequestHelper } from '../../utils/helpers'

export const office: RequestHandlerParams = [
  ...requiredFieldsHelper('code', 'name', 'address', 'ordersTemplate', 'docsTemplate'),
  badRequestHelper(),
]
