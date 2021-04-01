import BaseAPI from './BaseAPI'
import { config } from '@/api/helpers/axiosConfig'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Client } from '@/typings/api/client'

export class ClientAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getPaginated(params: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: `/paginated`,
        method: 'get',
        params,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getPaginatedNew(data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: `/paginated`,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getByName(name: string): AxiosResponseAPI<Client> {
    try {
      const response = await this.api.request<Client>({
        url: `/name/${name}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getOne(id: string): AxiosResponseAPI<Client> {
    try {
      const response = await this.api.request<Client>({
        url: `/${id}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async update(id: string, data: Partial<Client>): AxiosResponseAPI<Client> {
    try {
      const response = await this.api.request<Client>({
        url: `/${id}`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new ClientAPI({
  ...config,
  baseURL: `${config.baseURL}/client`,
})
