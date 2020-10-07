import { sendRequest } from '@/api/helpers'
import { ClientAPI, ClientEndpoints } from '@/typings/api/client'

export const clientEnpoints = (code?: string | number): ClientEndpoints => ({
  getAll: { method: 'get', link: `/client` },
  getById: { method: 'get', link: `/client/${code}` },
  getPaginated: { method: 'get', link: `/client/paginated` },
  getByName: { method: 'get', link: `/client/name/${code}` },
  create: { method: 'post', link: `/client` },
  updateById: { method: 'put', link: `/client/${code}` },
  deleteById: { method: 'delete', link: `/client/${code}` },
})

export const clientAPI = (code?: string | number): ClientAPI => ({
  getAll: async () => {
    try {
      const response = await sendRequest(clientEnpoints().getAll)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  getPaginated: async (data) => {
    try {
      const response = await sendRequest(clientEnpoints().getPaginated, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  getByName: async () => {
    try {
      const response = await sendRequest(clientEnpoints(code).getByName)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  create: async (data) => {
    try {
      const response = await sendRequest(clientEnpoints().create, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  updateById: async (data) => {
    try {
      const response = await sendRequest(clientEnpoints(code).updateById, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  deleteById: async () => {
    try {
      const response = await sendRequest(clientEnpoints(code).deleteById)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
})
