import { User } from '@/typings/api/auth'
import { Endpoint } from '@/typings/api/Endpoint'
import { Office } from '@/typings/api/office'
import { Client } from '@/typings/api/client'

export type CashInput = {
  orderid: number
  client?: string
  cashier?: string
  income?: number
  comment?: string
}

export type CashEndpoints = {
  getAll: Endpoint
  getAllByOffice: Endpoint
  getBalance: Endpoint
  getPaginated: Endpoint
  getByOrder: Endpoint
  createByOffice: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}

export type Cash = {
  income: number
  consumption: number
  balance: number
  orderid: number
  cashier: User
  client: Client
  office: Office
  id: number
  createdAt: string
  _id: string
  comment: string
}
