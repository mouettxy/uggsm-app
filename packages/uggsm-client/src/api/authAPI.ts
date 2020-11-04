import { AuthEndpoints, AuthInput, RegisterInput } from '@/typings/api/auth'
import { sendRequest } from '@/api/helpers'

export const authEnpoints = (): AuthEndpoints => ({
  login: { method: 'post', link: `/auth/login` },
  logout: { method: 'post', link: `/auth/logout` },
  register: { method: 'post', link: `/auth/register` },
})

export const authAPI = () => ({
  login: async (data: AuthInput) => {
    try {
      const response = await sendRequest(authEnpoints().login, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
  logout: async () => {
    try {
      const response = await sendRequest(authEnpoints().logout)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
  register: async (data: RegisterInput) => {
    try {
      const response = await sendRequest(authEnpoints().register, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
})
