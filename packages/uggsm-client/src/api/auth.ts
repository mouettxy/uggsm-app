import BaseAPI from './BaseAPI'
import { config } from '@/api/helpers/axiosConfig'
import { AxiosResponseAPI } from '@/typings/api/helpers'
import { AuthOutput, AuthInput, LogoutInput, RegisterInput, User } from '@/typings/api/auth'

export class AuthAPI extends BaseAPI {
  constructor(config: Record<string, any>) {
    super(config)
  }

  async login(data: AuthInput): AxiosResponseAPI<AuthOutput> {
    try {
      const response = await this.api.request<AuthOutput>({
        url: `/login`,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async logout(data: LogoutInput): AxiosResponseAPI<User> {
    try {
      const response = await this.api.request<User>({
        url: `/logout`,
        method: 'post',
        data,
      })

      return response
    } catch (error) {
      return error
    }
  }

  async register(data: RegisterInput): AxiosResponseAPI<User> {
    try {
      const response = await this.api.request<User>({
        url: `/register`,
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
  baseURL: `${config.baseURL}/auth`,
})
