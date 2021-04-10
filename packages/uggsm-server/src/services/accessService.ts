import { BaseService } from '../base'
import { AccessModel } from '../models'
import { api } from '../server'

export const accessServiceEmits = {
  updatedAll() {
    api.io.emit('access updated all')
  },
}

export class AccessService extends BaseService {
  constructor() {
    super(AccessModel)
  }
}

export default new AccessService()
