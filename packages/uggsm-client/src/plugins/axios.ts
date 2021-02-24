import { authModule } from '@/store'
import Vue from 'vue'
import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_URL_PRODUCTION
    : process.env.VUE_APP_API_URL_DEVELOPEMENT
const baseURLVersion =
  process.env.NODE_ENV === 'production'
    ? process.env.VUE_APP_API_VERSION_PRODUCTION
    : process.env.VUE_APP_API_VERSION_DEVELOPEMENT

export const config = {
  baseURL: `${baseURL}/${baseURLVersion}`,
  validateStatus: (status: any) => {
    return status < 500 // default
  },
  timeout: 3 * 1000,
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
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

_axios.interceptors.response.use(
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

Vue.prototype.$axios = _axios

export default _axios
