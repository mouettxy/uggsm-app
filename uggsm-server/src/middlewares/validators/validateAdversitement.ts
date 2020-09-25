import { RequestHandlerParams } from 'express-serve-static-core'
import { requiredFieldsHelper, badRequestHelper } from '../../utils/helpers'

export const adversitement: RequestHandlerParams = [...requiredFieldsHelper('name', 'title'), badRequestHelper()]
