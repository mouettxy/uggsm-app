import BaseAPI from './BaseAPI'
import { config } from '@/api/helpers/axiosConfig'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { User } from '@/typings/api/auth'

export type Users = User[]

export class UserAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async get(): AxiosResponseAPI<Users> {
    try {
      const response = await this.api.request<Users>({
        url: ``,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
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

  async getOne(id: string): AxiosResponseAPI<User> {
    try {
      const response = await this.api.request<User>({
        url: `${id}`,
        method: 'get',
      })

      return response
    } catch (error) {
      return error
    }
  }

  async update(id: string, data: Partial<User>): AxiosResponseAPI<User> {
    try {
      const response = await this.api.request<User>({
        url: `${id}`,
        method: 'put',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async delete(id: string): AxiosResponseAPI<User> {
    try {
      const response = await this.api.request<User>({
        url: `${id}`,
        method: 'delete',
      })

      return response
    } catch (error) {
      return error
    }
  }
}

export default new UserAPI({
  ...config,
  baseURL: `${config.baseURL}/user`,
})
