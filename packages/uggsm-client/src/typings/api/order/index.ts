import { Cash } from '@/typings/api/cash'
import { Adversitement } from '@/typings/api/adversitement'
import { User } from '@/typings/api/auth'
import { Client } from '@/typings/api/client'
import { Office } from '@/typings/api/office'
import { Endpoint } from '@/typings/api/Endpoint'

export type CompletedWork = {
  id: number

  userid: number

  username: string

  credentials: string

  header: string

  message: string

  price: number
}

export type SmsMessage = {
  id: number

  userid: number

  username: string

  header: string

  message: string

  sended: boolean

  date: Date
}

export type Comment = {
  id: number

  userid: number

  username: string

  header: string

  message: string

  date: Date
}

export type Workflow = {
  id: number

  message: string

  username: string

  header: string

  userid?: number

  date?: Date
}
export type Order = {
  id: number
  _id?: string
  __v?: any

  cash: Array<Cash>

  customer: Client

  customerName: string

  customerPhone: string

  office: Office

  officeCode: string

  phoneBrand: string

  manager: User

  master: User

  quick: boolean

  declaredPrice: number

  phoneModel: string

  serialNumber: string

  appearance: string

  orderType: string

  declaredDefect: string

  defect: string

  kit: string

  createdAt: Date

  password: string

  estimatedCloseAt: Date

  closedAt: Date

  adversitement: Adversitement

  status: string

  payed: boolean

  statusWork: CompletedWork[] | []

  statusSms: SmsMessage[] | []

  masterComments: Comment[] | []

  managerComments: Comment[] | []

  workflow: Workflow[] | []
}

export type OrdersAPI = {
  getAll(): Promise<any | null>
  getAllByOffice(): Promise<any | null>
  getById(): Promise<any | null>
  getPaginated(data: any): Promise<any | null>
  create(data: any): Promise<any | null>
  createByOffice(data: any): Promise<any | null>
  addSms(data: any): Promise<any | null>
  addCompletedWork(data: any): Promise<any | null>
  deleteCompletedWork(data: any): Promise<any | null>
  addMasterComment(data: any): Promise<any | null>
  addManagerComment(data: any): Promise<any | null>
  addWorkflow(data: any): Promise<any | null>
  setStatus(data: any): Promise<any | null>
  setPayed(data: any): Promise<any | null>
  setMaster(data: any): Promise<any | null>
  setManager(data: any): Promise<any | null>
  setOffice(data: any): Promise<any | null>
  updateById(data: any): Promise<any | null>
  deleteById(): Promise<any | null>
}

export type OrdersEndpoints = {
  getAll: Endpoint
  getPaginated: Endpoint
  getAllByOffice: Endpoint
  getById: Endpoint
  create: Endpoint
  createByOffice: Endpoint
  addSms: Endpoint
  addCompletedWork: Endpoint
  deleteCompletedWork: Endpoint
  addMasterComment: Endpoint
  addManagerComment: Endpoint
  addWorkflow: Endpoint
  setStatus: Endpoint
  setPayed: Endpoint
  setMaster: Endpoint
  setManager: Endpoint
  setOffice: Endpoint
  updateById: Endpoint
  deleteById: Endpoint
}
