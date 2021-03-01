import { Cash, CashInput } from '@/typings/api/cash'
import axios from 'axios'
import { config } from '@/plugins/axios'
import { AxiosResponseAPI } from '@/typings/api/helpers'

export class CashAPI {
  private apiConfig = {
    ...config,
    baseURL: `${config.baseURL}/cash`,
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

  async getBalance(officeCode: string): AxiosResponseAPI<{ balance: number }> {
    try {
      const response = await this.api.request<{ balance: number }>({
        url: `/balance/${officeCode}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async getByOrder(orderId: string): AxiosResponseAPI<Cash[]> {
    try {
      const response = await this.api.request<Cash[]>({
        url: `/order/${orderId}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async createByOffice(officeCode: string, data: CashInput): AxiosResponseAPI<Cash> {
    try {
      const response = await this.api.request<Cash>({
        url: `/${officeCode}`,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new CashAPI()
