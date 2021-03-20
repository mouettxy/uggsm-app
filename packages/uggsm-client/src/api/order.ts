import BaseAPI from './BaseAPI'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Order } from '@/typings/api/order'
import { SendSMSInput } from '@/store/orders'

export class OrderAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getPaginated(params: string): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request<any>({
        url: `/paginate`,
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

  async setStatus(orderId: string, data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/status`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async sendSms(orderId: string, data: SendSMSInput): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/sms`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async generateReport(params: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/reports/report`,
        method: 'get',
        params,
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
