import { AccessModel } from '../models'

export class AccessDatabase {
  public model = AccessModel

  public getPaginated = async (query, options) => {
    try {
      // @ts-ignore
      const response = await this.model.paginate(query, options)

      return response
    } catch (error) {
      return {
        status: 'ERROR',
        error: error,
        message: error.message,
      }
    }
  }
}

export default AccessDatabase
