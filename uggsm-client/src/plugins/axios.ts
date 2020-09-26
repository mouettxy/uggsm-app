import Vue from 'vue'
import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  baseURL: `${process.env.VUE_APP_API_URL}/${process.env.VUE_APP_API_VERSION}` || '',
  validateStatus: (status: any) => {
    return status < 500 // default
  },
  timeout: 60 * 1000
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function(config) {
    console.debug(`sending request to ${config.url}`)
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function(response) {
    console.debug(`response from request`, response)
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = _axios

export default _axios
