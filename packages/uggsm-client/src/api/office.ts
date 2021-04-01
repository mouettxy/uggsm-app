import BaseAPI from './BaseAPI'
import { config } from '@/api/helpers/axiosConfig'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Office } from '@/typings/api/office'

export class OfficeAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getAll(): AxiosResponseAPI<Office[]> {
    try {
      const response = await this.api.request<Office[]>({
        url: ``,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async create(data: Partial<Office>): AxiosResponseAPI<Office> {
    try {
      const response = await this.api.request<Office>({
        url: ``,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new OfficeAPI({
  ...config,
  baseURL: `${config.baseURL}/office`,
})
