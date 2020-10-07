import { ClientPhone } from './ClientPhone'

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
  phone: [ClientPhone]
  id: number
}
