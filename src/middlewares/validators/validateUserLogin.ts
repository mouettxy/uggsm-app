import { RequestHandlerParams } from 'express-serve-static-core'
import { requiredFieldsHelper, badRequestHelper } from '../../utils/helpers'

export const userLogin: RequestHandlerParams = [...requiredFieldsHelper('password', 'username'), badRequestHelper()]
