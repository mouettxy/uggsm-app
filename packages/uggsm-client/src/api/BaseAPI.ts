import { authModule } from '@/store'
import Vue from 'vue'
import axios, { AxiosInstance } from 'axios'

export class BaseAPI {
  public api: AxiosInstance

  constructor(config: Record<string, any>) {
    this.api = axios.create(config)

    this.api.interceptors.request.use(
      function (config) {
        config = {
          ...config,
          headers: {
            Authorization: `Bearer ${Vue.$cookies.get('UUID')}`,
          },
        }

        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )

    this.api.interceptors.response.use(
      function (response) {
        if (response.status === 401 && authModule.isLoggedIn) {
          authModule.logout('rejected')
        }
        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }
}

export default BaseAPI
