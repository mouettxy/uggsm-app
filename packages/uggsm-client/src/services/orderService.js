import { settingsModule } from '@/store'
import OrderAPI from '@/api/order'
import { cloneDeep } from 'lodash'
import moment from 'moment'

export const createOrder = async (data) => {
  const office = settingsModule.office.code

  const orderResponse = await OrderAPI.createOrder(office, data)

  if (orderResponse.status !== 200) {
    return {
      status: 'ERROR',
      message: 'Не удалось создать заказ',
    }
  }

  const smsResponse = await OrderAPI.sendSms(orderResponse.data.id, {
    phone: '8' + orderResponse.data.customerPhone || '',
    model: `${orderResponse.data.phoneBrand} ${orderResponse.data.phoneModel}`,
    type: 'order-created',
  })

  if (smsResponse.status !== 200) {
    return {
      status: 'WARNING',
      message: `Заказ ${orderResponse.data.id} создан, но отправить СМС не удалось`,
    }
  }

  return {
    status: 'OK',
    message: `Заказ ${orderResponse.data.id} успешно создан`,
  }
}

export const createWarrantyOrder = async (order, defect) => {
  // We need to ensure that we dont modify model
  const getWarrantyOrderFields = (order, defect) => {
    const fields = cloneDeep(order)

    fields.warrantyOrderId = fields.id
    fields.warrantySaved.push({ declaredDefect: fields.declaredDefect })
    fields.warrantyCounter += 1

    delete fields.id
    delete fields._id
    delete fields.__v

    return {
      ...fields,
      orderType: 'Гарантия',
      createdAt: moment().toISOString(),
      isWarranty: true,
      declaredDefect: defect,
      statusWork: [],
      master: fields.master._id,
      manager: fields.manager._id,
      office: fields.office._id,
      customer: fields.customer._id,
    }
  }

  const getUpdateOrderFields = (order, defect) => {
    const fields = cloneDeep(order)

    delete fields.id
    delete fields._id
    delete fields.__v

    fields.warrantySaved.push({ declaredDefect: defect })
    fields.warrantyCounter += 1

    return {
      ...fields,
      master: fields.master._id,
      manager: fields.manager._id,
      office: fields.office._id,
      customer: fields.customer._id,
    }
  }

  const office = settingsModule.office.code
  const updatedOrderResponse = await OrderAPI.updateById(order._id, getUpdateOrderFields(order, defect))

  if (updatedOrderResponse.status !== 200) {
    return {
      status: 'ERROR',
      message: 'Не удалось обновить заказ относящийся к гарантийному',
    }
  }

  const orderResponse = await OrderAPI.createOrder(office, getWarrantyOrderFields(order, defect))

  if (orderResponse.status !== 200) {
    return {
      status: 'ERROR',
      message: 'Не удалось создать гарантийный заказ',
    }
  }

  const warrantyId = `${orderResponse.data.warrantyOrderId}/${orderResponse.data.warrantyCounter}`

  const smsResponse = await OrderAPI.sendSms(orderResponse.data.id, {
    phone: '8' + orderResponse.data.customerPhone || '',
    model: `${orderResponse.data.phoneBrand} ${orderResponse.data.phoneModel}`,
    type: 'order-created',
    alternateId: warrantyId,
  })

  if (smsResponse.status !== 200) {
    return {
      status: 'WARNING',
      message: `Гарантийный заказ ${warrantyId} создан, но отправить СМС не удалось`,
    }
  }

  return {
    status: 'OK',
    message: `Гарантийный заказ ${warrantyId} успешно создан`,
  }
}
