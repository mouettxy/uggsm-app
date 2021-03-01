import axios from 'axios'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Order } from '@/typings/api/order'

export class OrderAPI {
  private apiConfig = {
    ...config,
    baseURL: `${config.baseURL}/order`,
  }

  private api = axios.create(this.apiConfig)

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
}

export default new OrderAPI()
