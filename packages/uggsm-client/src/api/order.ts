import BaseAPI from './BaseAPI'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Order } from '@/typings/api/order'

export class OrderAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getById(orderId: string): AxiosResponseAPI<Order> {
    try {
      const response = await this.api.request<Order>({
        url: `/${orderId}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async setEstimatedCloseAt(orderId: string, data: any): AxiosResponseAPI<Order> {
    try {
      const response = await this.api.request<Order>({
        url: `/${orderId}/estimated-close-time`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new OrderAPI({
  ...config,
  baseURL: `${config.baseURL}/order`,
})
