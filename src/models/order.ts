import { AutoIncrement } from '../utils'
import { createSchema, Type, typedModel } from 'ts-mongoose'

const statuses = ['Новый', 'На уточнении', 'В работе', 'Готов'] as const

const OrderSchema = createSchema({
  customer: Type.string({ required: true }),
  customerPhone: Type.string({ required: true }),
  branchOffice: Type.string({ required: true }),
  phoneModel: Type.string(),
  serialNumber: Type.string(),
  declaredDefect: Type.string(),
  overallKit: Type.string(),
  masterComments: Type.array().of({
    body: Type.string({ required: true }),
    date: Type.date({ required: true }),
  }),
  managerComments: Type.array().of({
    body: Type.string({ required: true }),
    date: Type.date({ required: true }),
  }),
  status: Type.string({ required: true, enum: statuses }),
  statusTiming: Type.array().of({
    status: Type.string({ enum: statuses }),
    who: Type.string(),
    date: Type.date(),
  }),
})

OrderSchema.plugin(AutoIncrement, { inc_field: 'identifier', start_seq: 30000 })

export const OrderModel = typedModel('Order', OrderSchema)
