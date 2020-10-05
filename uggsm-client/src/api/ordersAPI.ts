import { sendRequest } from '@/api/helpers'
import { OrdersAPI, OrdersEndpoints } from '@/typings/api/order'

export const ordersEndpoints = (code?: string | number): OrdersEndpoints => ({
  getAll: { method: 'get', link: `/order` },
  getAllByOffice: { method: 'get', link: `/order/office/${code}` },
  getPaginated: { method: 'get', link: `/order/paginate` },
  getById: { method: 'get', link: `/order/${code}` },
  create: { method: 'post', link: `/order` },
  createByOffice: { method: 'post', link: `/order/office/${code}` },
  addSms: { method: 'put', link: `/order/${code}/sms` },
  addCompletedWork: { method: 'put', link: `/order/${code}/completed-work` },
  addMasterComment: { method: 'put', link: `/order/${code}/master-comment` },
  addManagerComment: { method: 'put', link: `/order/${code}/manager-comment` },
  addWorkflow: { method: 'put', link: `/order/${code}/workflow` },
  setStatus: { method: 'put', link: `/order/${code}/status` },
  setPayed: { method: 'put', link: `/order/${code}/payed` },
  setMaster: { method: 'put', link: `/order/${code}/master` },
  setManager: { method: 'put', link: `/order/${code}/manager` },
  setOffice: { method: 'put', link: `/order/${code}/office` },
  updateById: { method: 'put', link: `/order/${code}` },
  deleteById: { method: 'delete', link: `/order` },
})

export const ordersAPI = (code?: string | number): OrdersAPI => ({
  getAll: async () => {
    try {
      const response = await sendRequest(ordersEndpoints().getAll)

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
      const response = await sendRequest(ordersEndpoints().getPaginated, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  getAllByOffice: async () => {
    try {
      const response = await sendRequest(ordersEndpoints(code).getAllByOffice)
      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve([])
      }
    } catch (error) {
      return Promise.resolve([])
    }
  },
  getById: async () => {
    try {
      const response = await sendRequest(ordersEndpoints(code).getById)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  create: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints().create, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  createByOffice: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).createByOffice, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  addSms: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).addSms, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  addCompletedWork: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).addCompletedWork, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  addMasterComment: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).addMasterComment, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  addManagerComment: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).addManagerComment, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  addWorkflow: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).addWorkflow, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  setStatus: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).setStatus, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  setPayed: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).setPayed, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  setMaster: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).setMaster, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  setManager: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).setManager, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  setOffice: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).setOffice, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  updateById: async (data: any) => {
    try {
      const response = await sendRequest(ordersEndpoints(code).updateById, data)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
  deleteById: async () => {
    try {
      const response = await sendRequest(ordersEndpoints(code).deleteById)

      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.resolve(null)
      }
    } catch (error) {
      return Promise.resolve(null)
    }
  },
})
