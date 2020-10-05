import { Cash, CashEndpoints } from '@/typings/api/cash'
import { sendRequest } from '@/api/helpers'
import { CashInput } from '@/typings/api/cash/CashInput'

export const cashEndpoints = (code?: string): CashEndpoints => ({
  getAll: { method: 'get', link: `/cash` },
  getAllByOffice: { method: 'get', link: `/cash/${code}` },
  getByOrder: { method: 'get', link: `/cash/order/${code}` },
  createByOffice: { method: 'post', link: `/cash/${code}` },
  updateById: { method: 'put', link: `/cash/${code}` },
  deleteById: { method: 'delete', link: `/cash/${code}` },
})

export const officeAPI = (code?: string) => ({
  getAll: async (): Promise<Array<Cash> | []> => {
    try {
      const response = await sendRequest(cashEndpoints().getAll)

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  },
  getAllByOffice: async (): Promise<Array<Cash> | []> => {
    try {
      const response = await sendRequest(cashEndpoints(code).getAllByOffice)

      if (response.status === 200) {
        return response.data
      } else {
        return []
      }
    } catch (error) {
      return []
    }
  },
  getByOrder: async (): Promise<Array<Cash> | []> => {
    try {
      const response = await sendRequest(cashEndpoints(code).getByOrder)

      if (response.status === 200) {
        return response.data
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  createByOffice: async (data: CashInput) => {
    try {
      const response = await sendRequest(cashEndpoints(code).createByOffice, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
  updateById: async (data: Cash) => {
    try {
      const response = await sendRequest(cashEndpoints(code).updateById, data)

      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  },
  deleteById: async () => {
    try {
      const response = await sendRequest(cashEndpoints(code).deleteById)

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
