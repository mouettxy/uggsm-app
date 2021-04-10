import BaseAPI from './BaseAPI'
import { config } from '@/api/helpers/axiosConfig'
import { AxiosResponseAPI } from '@/typings/api/helpers'

export class AuthAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async getPaginated(data: any): AxiosResponseAPI<any> {
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
}

export default new AuthAPI({
  ...config,
  baseURL: `${config.baseURL}/access`,
})
