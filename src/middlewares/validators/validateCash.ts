import { RequestHandlerParams } from 'express-serve-static-core'
import { requiredFieldsHelper, badRequestHelper } from '../../utils/helpers'

export const cash: RequestHandlerParams = [...requiredFieldsHelper('office'), badRequestHelper()]
