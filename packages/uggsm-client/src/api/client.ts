import BaseAPI from './BaseAPI'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Client } from '@/typings/api/client'

export class ClientAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getPaginated(data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: `/paginated`,
        method: 'get',
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
}

export default new ClientAPI({
  ...config,
  baseURL: `${config.baseURL}/client`,
})
