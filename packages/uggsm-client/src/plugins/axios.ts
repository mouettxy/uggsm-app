import { authModule } from '@/store'
import { config } from '@/api/helpers/axiosConfig'
import Vue from 'vue'
import axios from 'axios'

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
