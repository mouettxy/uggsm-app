import BaseAPI from './BaseAPI'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'

export class EmailSubscriptionAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getAll(): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: ``,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async create(data: { type: string; email: string }): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: ``,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async delete(subscriptionId: string): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: `${subscriptionId}`,
        method: 'delete',
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new EmailSubscriptionAPI({
  ...config,
  baseURL: `${config.baseURL}/email-subscriptions`,
})
