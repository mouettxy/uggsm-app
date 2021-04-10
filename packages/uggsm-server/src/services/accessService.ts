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
    super(AccessModel, accessServiceEmits)
  }
}

export default new AccessService()
