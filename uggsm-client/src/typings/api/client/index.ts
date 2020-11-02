import { Endpoint } from '@/typings/api/Endpoint'

export type ClientPhone = {
  id: number
  phone: string
  comment: string
}

export type Client = {
  createdAt: string
  discount: string
  address: string
  allowedEmailNotifications: boolean
  allowedNotifications: boolean
  clientType: string
  isProvider: boolean
  email: string
  isConflict: boolean
  _id: string
  name: string
  phone: ClientPhone[]
  id: number
}

export type ClientInput = {
  discount: number
  allowedEmailNotifications: boolean
  allowedNotifications: boolean
  clientType?: string
  isProvider?: boolean
  isConflict?: boolean
  name: string
  phone: string
}

export type ClientEndpoints = {
  getAll: Endpoint
  getPaginated: Endpoint
  getByName: Endpoint
  getById: Endpoint
  create: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}

export type ClientAPI = {
  getAll(): Promise<Array<Client> | []>
  getPaginated(options: any): Promise<Array<Client> | []>
  getByName(): Promise<Client | null>
  create(data: ClientInput): Promise<Client | null>
  updateById(data: Client): Promise<Client | null>
  deleteById(): Promise<string>
}
