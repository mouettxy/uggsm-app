import axios from 'axios'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Client } from '@/typings/api/client'

export class ClientAPI {
  private apiConfig = {
    ...config,
    baseURL: `${config.baseURL}/client`,
  }

  private api = axios.create(this.apiConfig)

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

export default new ClientAPI()
