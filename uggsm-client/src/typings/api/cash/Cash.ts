import { User } from '../auth'
import { Client } from '../client'
import { Office } from '../office'

export type Cash = {
  income: number
  consumption: number
  balance: number
  orderid: number
  clientid: number
  cahierid: number
  user: User
  client: Client
  office: Office
  id: number
  createdAt: string
  _id: string
  comment: string
}
