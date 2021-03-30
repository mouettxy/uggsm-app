import BaseAPI from './BaseAPI'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { Order } from '@/typings/api/order'

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

  async updateById(orderId: string | number, data: any): AxiosResponseAPI<Order> {
    try {
      const response = await this.api.request<Order>({
        url: `/${orderId}`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async createOrder(officeCode: string, data: any): AxiosResponseAPI<Order> {
    try {
      const response = await this.api.request<Order>({
        url: `/office/${officeCode}`,
        method: 'post',
        data,
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

  async sendSms(orderId: string, data: any): AxiosResponseAPI<any> {
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

  async addCompletedWork(orderId: string, data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/completed-work`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async addOrderComment(orderId: string, data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/master-comment`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async setOffice(orderId: string, data: any): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/office`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async deleteCompletedWork(orderId: string | number, workId: string | number): AxiosResponseAPI<any> {
    try {
      const response = await this.api.request({
        url: `/${orderId}/completed-work/${workId}`,
        method: 'delete',
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
