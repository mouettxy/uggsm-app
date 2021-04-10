import { ServiceException } from '../exceptions'

export interface BaseServiceInterface {
  model: any
  getPaginated: (query: any, options: any) => Promise<any | ServiceException>
  getAll: (query: any, options: any) => Promise<any | ServiceException>
  getOne: (query: any) => Promise<any | ServiceException>
  create: (data: any) => Promise<any | ServiceException>
  update: (query: any, options: any) => Promise<any | ServiceException>
  delete: (query: any) => Promise<any | ServiceException>
}

export class BaseService implements BaseServiceInterface {
  public model

  constructor(model) {
    this.model = model
  }

  public getPaginated = async (query, options) => {
    try {
      const response = await this.model.paginate(query, options)

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  public getAll = async () => {
    try {
      const response = await this.model.find()

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  public getOne = async (query) => {
    try {
      const response = await this.model.findOne(query)

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  public create = async (data: any) => {
    try {
      const response = new this.model(data)

      await response.save()

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  public update = async (query: any, data: any) => {
    try {
      const response = await this.model.findOneAndUpdate(query, data, { new: true })

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  public delete = async (query) => {
    try {
      const response = await this.model.findOneAndDelete(query)

      return response
    } catch (error) {
      throw new ServiceException(error)
    }
  }
}

export default BaseService
