import { ClientPhone } from './ClientPhone'

export type Client = {
  createdAt: string
  discount: string
  allowedEmailNotifications: string
  allowedNotifications: string
  clientType: string
  isProvider: string
  isConflict: string
  _id: string
  name: string
  phone: [ClientPhone]
  id: string
}
