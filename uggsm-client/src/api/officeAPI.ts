import { OfficeEndpoints } from '@/typings/api/office'
import { sendRequest } from '@/api/helpers'

export const officeEndpoints = (code?: string): OfficeEndpoints => ({
  getAll: { method: 'get', link: `/office` },
  getByCode: { method: 'get', link: `/office/${code}` },
  create: { method: 'post', link: `/office` },
  update: { method: 'put', link: `/office/${code}` },
  delete: { method: 'delete', link: `/office/${code}` }
})

export const officeAPI = (code?: string) => ({
  getAll: async () => {
    try {
      const response = await sendRequest(officeEndpoints().getAll)

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      console.log(error)
      return []
    }
  },
  getByCode: async () => {
    try {
      const response = await sendRequest(officeEndpoints(code).getByCode)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  },
  create: async (data: any) => {
    try {
      const response = await sendRequest(officeEndpoints(code).create, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  },
  update: async (data: any) => {
    try {
      const response = await sendRequest(officeEndpoints(code).update, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  },
  delete: async (data: any) => {
    try {
      const response = await sendRequest(officeEndpoints(code).delete, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
})
