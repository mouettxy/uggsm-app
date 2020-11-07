import { Order } from '../order'

export type Call = {
  dbId: number
  relatedOrder: Order
  incoming: boolean
  answered: boolean
  clientNumber: string
  manager: string
  managerNumber: string
  record: string
  startTime: Date
  endTime: Date
  answerTime: Date
}
